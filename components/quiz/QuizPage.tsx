"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { AudioPlayer } from "@/components/quiz/AudioPlayer";
import { FileSelector } from "@/components/quiz/FileSelector";
import { ProgressTracker } from "@/components/quiz/ProgressTracker";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";
import { ReviewPanel } from "@/components/quiz/ReviewPanel";
import { ScoreSummary } from "@/components/quiz/ScoreSummary";
import { SectionNavigator } from "@/components/quiz/SectionNavigator";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchQuizQuestions, fetchQuizSets } from "@/lib/supabase/quiz";
import {
  clearProgress,
  loadProgress,
  saveProgress,
  saveResult
} from "@/lib/quiz-storage";
import type {
  QuizMode,
  QuizProgress,
  QuizQuestion,
  QuizResult,
  QuizSet,
  SectionScore
} from "@/types/quiz";

interface QuizPageProps {
  mode: QuizMode;
}

type QuizStatus = "select" | "loading" | "quiz" | "review" | "error";

export function QuizPage({ mode }: QuizPageProps) {
  const [files, setFiles] = useState<QuizSet[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [status, setStatus] = useState<QuizStatus>("select");
  const [selectedFile, setSelectedFile] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, QuizProgress | null>>({});
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadFiles = async () => {
      setFilesLoading(true);
      const loaded = await fetchQuizSets(mode);
      if (isMounted) {
        setFiles(loaded);
        setFilesLoading(false);
      }
    };
    loadFiles();
    return () => {
      isMounted = false;
    };
  }, [mode]);

  useEffect(() => {
    if (files.length === 0) {
      setProgressMap({});
      return;
    }
    const loadProgressMap = async () => {
      const entries = await Promise.all(
        files.map(async (file) => {
          const progress = await loadProgress(buildQuizId(mode, file.id));
          return [file.id, progress] as const;
        })
      );
      setProgressMap(Object.fromEntries(entries));
    };
    loadProgressMap();
  }, [files, mode, status]);

  const startQuiz = useCallback(
    async (file: QuizSet, resume: boolean) => {
      setStatus("loading");
      setSelectedFile(file);
      setError(null);
      try {
        const loadedQuestions = await fetchQuizQuestions(file);
        if (loadedQuestions.length === 0) {
          throw new Error("No valid questions found in this file.");
        }
        const quizId = buildQuizId(mode, file.id);
        const progress = resume ? await loadProgress(quizId) : null;
        const safeAnswers =
          progress && progress.answers.length === loadedQuestions.length
            ? progress.answers
            : Array.from({ length: loadedQuestions.length }, () => null);
        const safeIndex = Math.min(
          progress?.currentIndex ?? 0,
          loadedQuestions.length - 1
        );
        setQuestions(loadedQuestions);
        setAnswers(safeAnswers);
        setCurrentIndex(safeIndex);
        setStatus("quiz");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz.");
        setStatus("error");
      }
    },
    [mode]
  );

  useEffect(() => {
    if (status !== "quiz" || !selectedFile) {
      return;
    }
    const quizId = buildQuizId(mode, selectedFile.id);
    const progress: QuizProgress = {
      quizId,
      mode,
      fileName: selectedFile.name,
      currentIndex,
      answers,
      startedAt: progressMap[selectedFile.id]?.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    void saveProgress(progress);
  }, [answers, currentIndex, mode, progressMap, selectedFile, status]);

  const handleSelect = (answerId: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = answerId;
      return updated;
    });
  };

  const finishQuiz = async () => {
    if (!selectedFile) {
      return;
    }
    const correct = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.answerId ? 1 : 0);
    }, 0);

    const sectionScores = buildSectionScores(questions, answers);
    const quizId = buildQuizId(mode, selectedFile.id);
    const result: QuizResult = {
      quizId,
      mode,
      fileName: selectedFile.name,
      score: Math.round((correct / questions.length) * 250),
      correct,
      total: questions.length,
      completedAt: new Date().toISOString(),
      answers,
      sectionScores
    };

    await saveResult(result);
    await clearProgress(quizId);
    setLastResult(result);
    setStatus("review");
  };

  const retryQuiz = (onlyIncorrect: boolean) => {
    if (!selectedFile) {
      return;
    }
    const resetAnswers = answers.map((answer, index) => {
      if (onlyIncorrect && answer === questions[index].answerId) {
        return answer;
      }
      return null;
    });
    setAnswers(resetAnswers);
    setCurrentIndex(0);
    setStatus("quiz");
  };

  if (status === "select") {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <Button variant="ghost" asChild>
            <Link href="/">← Back to home</Link>
          </Button>
          <h1 className="text-2xl font-semibold">
            {mode === "jft-mockup" ? "JFT Mockup" : "Kisi-kisi"} mode
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a file to begin. Resume your last attempt or start fresh.
          </p>
        </header>
        {filesLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading quizzes...</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Fetching quiz sets from the database.
            </CardContent>
          </Card>
        ) : (
          <FileSelector files={files} progressMap={progressMap} onStart={startQuiz} />
        )}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading quiz...</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Preparing your questions.
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{error}</p>
          <Button onClick={() => setStatus("select")}>Back to selection</Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "review") {
    const correct = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.answerId ? 1 : 0);
    }, 0);
    const hasIncorrect = answers.some(
      (answer, index) => answer !== questions[index].answerId
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" asChild>
            <Link href="/">← Back to home</Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => retryQuiz(false)}>
              Retry quiz
            </Button>
            {hasIncorrect ? (
              <Button onClick={() => retryQuiz(true)}>Retry incorrect</Button>
            ) : null}
          </div>
        </div>
        <ScoreSummary correct={correct} total={questions.length} />
        {lastResult ? <ExportButton result={lastResult} /> : null}
        <ReviewPanel questions={questions} answers={answers} />
      </div>
    );
  }

  const question = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const canGoNext = Boolean(selectedAnswer);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            if (selectedFile) {
              await clearProgress(buildQuizId(mode, selectedFile.id));
            }
            setStatus("select");
          }}
        >
          Exit quiz
        </Button>
      </header>
      <ProgressTracker current={currentIndex} total={questions.length} />
      {mode === "jft-mockup" ? (
        <SectionNavigator
          questions={questions}
          currentIndex={currentIndex}
          onJump={setCurrentIndex}
        />
      ) : null}
      {question.assetUrls && question.assetUrls.length > 0 ? (
        <AudioPlayer sources={question.assetUrls} />
      ) : null}
      <QuestionCard
        question={question}
        index={currentIndex}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
      />
      <QuizNavigation
        canGoBack={currentIndex > 0}
        canGoNext={canGoNext}
        isLast={currentIndex === questions.length - 1}
        onBack={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
        onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
        onFinish={finishQuiz}
      />
    </div>
  );
}

function buildQuizId(mode: QuizMode, fileId: string) {
  return `${mode}-${fileId}`;
}

function buildSectionScores(
  questions: QuizQuestion[],
  answers: (string | null)[]
): SectionScore[] {
  const scores: Record<string, SectionScore> = {};
  questions.forEach((question, index) => {
    if (!scores[question.section]) {
      scores[question.section] = { section: question.section, correct: 0, total: 0 };
    }
    scores[question.section].total += 1;
    if (answers[index] === question.answerId) {
      scores[question.section].correct += 1;
    }
  });
  return Object.values(scores);
}
