"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { QuizSetForm } from "@/components/admin/QuizSetForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  fetchAdminQuizSetDetail,
  updateQuestion,
  updateQuizSet,
  upsertOptions
} from "@/lib/supabase/admin";
import type { QuizQuestion, QuizSet } from "@/types/quiz";

export default function AdminQuizSetDetailPage() {
  const params = useParams();
  const quizSetId = params?.id as string | undefined;
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!quizSetId) {
      return;
    }
    const load = async () => {
      const { quizSet: setData, questions: questionData } =
        await fetchAdminQuizSetDetail(quizSetId);
      setQuizSet(setData);
      setQuestions(questionData);
    };
    load();
  }, [quizSetId]);

  const handleSaveAll = async () => {
    if (!quizSet) {
      return;
    }
    setIsSaving(true);
    const updated = await updateQuizSet(quizSet.id, {
      mode: quizSet.mode,
      name: quizSet.name,
      description: quizSet.description,
      level: quizSet.level
    });

    for (const question of questions) {
      await updateQuestion(question.id, {
        prompt: question.prompt,
        section: question.section,
        answerId: question.answerId,
        imageUrl: question.imageUrl
      });
      await upsertOptions(
        question.id,
        question.options.map((option, index) => ({
          choiceId: option.id,
          text: option.text,
          imageUrl: option.imageUrl,
          orderIndex: index
        }))
      );
    }

    setIsSaving(false);
    setMessage(updated ? "Changes saved." : "Failed to save updates.");
  };

  if (!isSupabaseConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase not configured</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add your Supabase credentials in .env or .env.local to enable admin
          editing.
        </CardContent>
      </Card>
    );
  }

  if (!quizSet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading quiz set...</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Fetching details from Supabase.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/quiz-sets">← Back to quiz sets</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit quiz set</CardTitle>
        </CardHeader>
        <CardContent>
          <QuizSetForm
            initialValues={{
              name: quizSet.name,
              mode: quizSet.mode,
              description: quizSet.description,
              level: quizSet.level
            }}
            onSave={(values) => {
              setQuizSet({ ...quizSet, ...values });
              setMessage("Quiz set updated locally. Save all changes to persist.");
            }}
          />
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Questions</h2>
        <Button onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save all changes"}
        </Button>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Question {index + 1}
            </p>
            <QuestionEditor
              question={question}
              onChange={(updated) => {
                const next = [...questions];
                next[index] = updated;
                setQuestions(next);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
