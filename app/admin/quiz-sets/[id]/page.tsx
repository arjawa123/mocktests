/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Circle, CircleCheck, CircleX, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  fetchAdminQuizSetDetail,
  updateQuizSet,
  updateQuestion,
  upsertOptions
} from "@/lib/supabase/admin";
import type { QuizOption, QuizQuestion, QuizSet } from "@/types/quiz";

type QuizSetField = "name" | "mode" | "description" | "level";
type QuestionField = "section" | "prompt" | "answerId" | "imageUrl";

type ModalState =
  | { type: "quizSetField"; field: QuizSetField }
  | { type: "questionField"; questionIndex: number; field: QuestionField }
  | { type: "questionOption"; questionIndex: number; optionIndex: number }
  | { type: "questionRow"; questionIndex: number }
  | null;

export default function AdminQuizSetDetailPage() {
  const params = useParams();
  const quizSetId = params?.id as string | undefined;
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, string | null>>({});
  const [draftValue, setDraftValue] = useState("");
  const [draftOption, setDraftOption] = useState<QuizOption | null>(null);
  const [draftQuestion, setDraftQuestion] = useState<QuizQuestion | null>(null);
  const editableCellClass =
    "group relative cursor-pointer rounded-md border border-transparent px-2 py-1 transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35";
  const onKeyActivate = (
    event: React.KeyboardEvent<HTMLDivElement>,
    action: () => void
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    action();
  };

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

  useEffect(() => {
    setReviewAnswers({});
  }, [quizSetId, questions.length]);

  const maxOptions = questions.reduce((max, question) => {
    return Math.max(max, question.options.length);
  }, 0);

  const persistQuestion = async (updatedQuestion: QuizQuestion) => {
    setIsSaving(true);
    const updated = await updateQuestion(updatedQuestion.id, {
      prompt: updatedQuestion.prompt,
      section: updatedQuestion.section,
      answerId: updatedQuestion.answerId,
      imageUrl: updatedQuestion.imageUrl
    });
    const updatedOptions = await upsertOptions(
      updatedQuestion.id,
      updatedQuestion.options.map((option, index) => ({
        choiceId: option.id,
        text: option.text,
        imageUrl: option.imageUrl,
        orderIndex: index
      }))
    );
    setIsSaving(false);

    if (!updated || !updatedOptions) {
      setMessage("Failed to save question update.");
      return false;
    }

    setQuestions((prev) =>
      prev.map((question) => (question.id === updatedQuestion.id ? updatedQuestion : question))
    );
    setMessage("Question updated.");
    return true;
  };

  const handleSaveQuizSetField = async () => {
    if (!quizSet) {
      return;
    }

    const payload = {
      mode: quizSet.mode,
      name: quizSet.name,
      description: quizSet.description,
      level: quizSet.level
    };

    if (modal?.type === "quizSetField") {
      if (modal.field === "mode") {
        payload.mode = draftValue as QuizSet["mode"];
      } else if (modal.field === "name") {
        payload.name = draftValue;
      } else if (modal.field === "description") {
        payload.description = draftValue || undefined;
      } else if (modal.field === "level") {
        payload.level = draftValue || null;
      }
    }

    setIsSaving(true);
    const updated = await updateQuizSet(quizSet.id, payload);
    setIsSaving(false);

    if (!updated) {
      setMessage("Failed to update quiz set.");
      return;
    }

    setQuizSet((prev) => (prev ? { ...prev, ...payload } : prev));
    setModal(null);
    setMessage("Quiz set updated.");
  };

  const openQuizSetFieldModal = (field: QuizSetField) => {
    if (!quizSet) {
      return;
    }
    const value =
      field === "name"
        ? quizSet.name
        : field === "mode"
          ? quizSet.mode
          : field === "description"
            ? quizSet.description ?? ""
            : quizSet.level ?? "";
    setDraftValue(value);
    setModal({ type: "quizSetField", field });
  };

  const openQuestionFieldModal = (questionIndex: number, field: QuestionField) => {
    const question = questions[questionIndex];
    if (!question) {
      return;
    }
    const value =
      field === "section"
        ? question.section
        : field === "prompt"
          ? question.prompt
          : field === "answerId"
            ? question.answerId
            : question.imageUrl ?? "";
    setDraftValue(value);
    setModal({ type: "questionField", questionIndex, field });
  };

  const openQuestionOptionModal = (questionIndex: number, optionIndex: number) => {
    const option = questions[questionIndex]?.options[optionIndex];
    if (!option) {
      return;
    }
    setDraftOption({ ...option });
    setModal({ type: "questionOption", questionIndex, optionIndex });
  };

  const openQuestionRowModal = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) {
      return;
    }
    setDraftQuestion({
      ...question,
      options: question.options.map((option) => ({ ...option }))
    });
    setModal({ type: "questionRow", questionIndex });
  };

  const handleSaveQuestionField = async () => {
    if (modal?.type !== "questionField") {
      return;
    }
    const question = questions[modal.questionIndex];
    if (!question) {
      return;
    }
    const updatedQuestion: QuizQuestion = {
      ...question,
      section: modal.field === "section" ? draftValue : question.section,
      prompt: modal.field === "prompt" ? draftValue : question.prompt,
      answerId: modal.field === "answerId" ? draftValue : question.answerId,
      imageUrl: modal.field === "imageUrl" ? draftValue || null : question.imageUrl
    };
    const success = await persistQuestion(updatedQuestion);
    if (success) {
      setModal(null);
    }
  };

  const handleSaveQuestionOption = async () => {
    if (modal?.type !== "questionOption" || !draftOption) {
      return;
    }
    const question = questions[modal.questionIndex];
    if (!question) {
      return;
    }
    const updatedOptions = question.options.map((option, index) =>
      index === modal.optionIndex
        ? {
            ...option,
            text: draftOption.text,
            imageUrl: draftOption.imageUrl || null
          }
        : option
    );
    const success = await persistQuestion({ ...question, options: updatedOptions });
    if (success) {
      setModal(null);
      setDraftOption(null);
    }
  };

  const handleSaveQuestionRow = async () => {
    if (modal?.type !== "questionRow" || !draftQuestion) {
      return;
    }
    const success = await persistQuestion(draftQuestion);
    if (success) {
      setModal(null);
      setDraftQuestion(null);
    }
  };

  const handleReviewAnswer = (questionId: string, optionId: string) => {
    setReviewAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
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
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2">Field</th>
                <th className="py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60">
                <td className="py-3 font-medium">Name</td>
                <td className="py-3">
                  <div
                    role="button"
                    tabIndex={0}
                    className={editableCellClass}
                    onClick={() => openQuizSetFieldModal("name")}
                    onKeyDown={(event) =>
                      onKeyActivate(event, () => openQuizSetFieldModal("name"))
                    }
                  >
                    <span>{quizSet.name}</span>
                    <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                      <Pencil className="h-3 w-3" />
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 font-medium">Mode</td>
                <td className="py-3">
                  <div
                    role="button"
                    tabIndex={0}
                    className={editableCellClass}
                    onClick={() => openQuizSetFieldModal("mode")}
                    onKeyDown={(event) =>
                      onKeyActivate(event, () => openQuizSetFieldModal("mode"))
                    }
                  >
                    <span>{quizSet.mode}</span>
                    <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                      <Pencil className="h-3 w-3" />
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 font-medium">Description</td>
                <td className="py-3">
                  <div
                    role="button"
                    tabIndex={0}
                    className={editableCellClass}
                    onClick={() => openQuizSetFieldModal("description")}
                    onKeyDown={(event) =>
                      onKeyActivate(event, () => openQuizSetFieldModal("description"))
                    }
                  >
                    <span>{quizSet.description || "-"}</span>
                    <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                      <Pencil className="h-3 w-3" />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Level</td>
                <td className="py-3">
                  <div
                    role="button"
                    tabIndex={0}
                    className={editableCellClass}
                    onClick={() => openQuizSetFieldModal("level")}
                    onKeyDown={(event) =>
                      onKeyActivate(event, () => openQuizSetFieldModal("level"))
                    }
                  >
                    <span>{quizSet.level || "-"}</span>
                    <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                      <Pencil className="h-3 w-3" />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Questions</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isReviewMode ? "default" : "outline"}
            onClick={() => setIsReviewMode((prev) => !prev)}
          >
            {isReviewMode ? "Table mode" : "Review mode"}
          </Button>
          {isReviewMode ? (
            <Button size="sm" variant="outline" onClick={() => setReviewAnswers({})}>
              Reset review
            </Button>
          ) : null}
        </div>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {isReviewMode ? (
        <div className="space-y-4">
          {questions.map((question, questionIndex) => {
            const selectedAnswer = reviewAnswers[question.id] ?? null;
            const isAnswered = Boolean(selectedAnswer);
            const isCorrect = selectedAnswer === question.answerId;
            const correctOption = question.options.find(
              (option) => option.id === question.answerId
            );

            return (
              <Card key={question.id} className="border-border/70">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      {isAnswered ? (
                        isCorrect ? (
                          <CircleCheck className="h-4 w-4 text-success" />
                        ) : (
                          <CircleX className="h-4 w-4 text-destructive" />
                        )
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>
                        {questionIndex + 1}. <span className="text-destructive">*</span>
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isAnswered && isCorrect ? "5/5" : "0/5"}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed">{question.prompt}</p>

                  {question.imageUrl ? (
                    <img
                      src={question.imageUrl}
                      alt={`Question ${questionIndex + 1}`}
                      className="max-h-64 w-auto rounded border border-border"
                    />
                  ) : null}

                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const selectedIsWrong = isSelected && isAnswered && !isCorrect;
                      const selectedIsCorrect = isSelected && isAnswered && isCorrect;

                      return (
                        <button
                          key={`${question.id}-${option.id}`}
                          type="button"
                          onClick={() => handleReviewAnswer(question.id, option.id)}
                          className={[
                            "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                            selectedIsCorrect
                              ? "border-success/45 bg-success/15 text-foreground"
                              : selectedIsWrong
                                ? "border-destructive/45 bg-destructive/10 text-foreground"
                                : "border-border bg-background hover:bg-muted/40"
                          ].join(" ")}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={[
                                "inline-flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                                isSelected
                                  ? "border-primary"
                                  : "border-muted-foreground/60"
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "h-2 w-2 rounded-full transition-colors",
                                  isSelected ? "bg-primary" : "bg-transparent"
                                ].join(" ")}
                              />
                            </span>
                            <span>{option.text}</span>
                          </span>
                          {selectedIsCorrect ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : selectedIsWrong ? (
                            <X className="h-4 w-4 text-destructive" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && !isCorrect && correctOption ? (
                    <div className="space-y-2 rounded-md border border-success/35 bg-success/10 p-3">
                      <p className="text-sm font-medium text-success">Jawaban yang benar</p>
                      <div className="inline-flex items-center gap-2 text-sm">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-success">
                          <span className="h-2 w-2 rounded-full bg-success" />
                        </span>
                        <span>{correctOption.text}</span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto pt-6">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">No</th>
                  <th className="py-2 pr-3">Section</th>
                  <th className="py-2 pr-3">Prompt</th>
                  <th className="py-2 pr-3">Answer ID</th>
                  <th className="py-2 pr-3">Image</th>
                  {Array.from({ length: maxOptions }).map((_, optionIndex) => (
                    <th key={`head-option-${optionIndex}`} className="py-2 pr-3">
                      Option {String.fromCharCode(65 + optionIndex)}
                    </th>
                  ))}
                  <th className="py-2 pr-3">Row action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, questionIndex) => (
                  <tr key={question.id} className="border-b border-border/60 align-top">
                    <td className="py-3 pr-3 font-medium">{questionIndex + 1}</td>
                    <td className="py-3 pr-3">
                      <div
                        role="button"
                        tabIndex={0}
                        className={editableCellClass}
                        onClick={() => openQuestionFieldModal(questionIndex, "section")}
                        onKeyDown={(event) =>
                          onKeyActivate(event, () =>
                            openQuestionFieldModal(questionIndex, "section")
                          )
                        }
                      >
                        <p>{question.section}</p>
                        <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                          <Pencil className="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div
                        role="button"
                        tabIndex={0}
                        className={editableCellClass}
                        onClick={() => openQuestionFieldModal(questionIndex, "prompt")}
                        onKeyDown={(event) =>
                          onKeyActivate(event, () =>
                            openQuestionFieldModal(questionIndex, "prompt")
                          )
                        }
                      >
                        <p className="line-clamp-3 max-w-md">{question.prompt}</p>
                        <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                          <Pencil className="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div
                        role="button"
                        tabIndex={0}
                        className={editableCellClass}
                        onClick={() => openQuestionFieldModal(questionIndex, "answerId")}
                        onKeyDown={(event) =>
                          onKeyActivate(event, () =>
                            openQuestionFieldModal(questionIndex, "answerId")
                          )
                        }
                      >
                        <p>{question.answerId}</p>
                        <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                          <Pencil className="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div
                        role="button"
                        tabIndex={0}
                        className={editableCellClass}
                        onClick={() => openQuestionFieldModal(questionIndex, "imageUrl")}
                        onKeyDown={(event) =>
                          onKeyActivate(event, () =>
                            openQuestionFieldModal(questionIndex, "imageUrl")
                          )
                        }
                      >
                        <p className="max-w-[180px] truncate">{question.imageUrl || "-"}</p>
                        <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                          <Pencil className="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                    {Array.from({ length: maxOptions }).map((_, optionIndex) => {
                      const option = question.options[optionIndex];
                      return (
                        <td key={`${question.id}-option-${optionIndex}`} className="py-3 pr-3">
                          {option ? (
                            <div
                              role="button"
                              tabIndex={0}
                              className={editableCellClass}
                              onClick={() => openQuestionOptionModal(questionIndex, optionIndex)}
                              onKeyDown={(event) =>
                                onKeyActivate(event, () =>
                                  openQuestionOptionModal(questionIndex, optionIndex)
                                )
                              }
                            >
                              <p className="line-clamp-3 max-w-[190px]">
                                <span className="font-semibold">{option.id}. </span>
                                {option.text}
                              </p>
                              <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded border border-border/70 bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 md:flex">
                                <Pencil className="h-3 w-3" />
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 pr-3">
                      <Button size="sm" onClick={() => openQuestionRowModal(questionIndex)}>
                        Edit row
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {modal ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex min-h-full w-full items-start justify-center py-6">
            <Card className="w-full max-w-5xl rounded-xl bg-background text-foreground shadow-2xl">
              <CardHeader className="sticky top-0 z-10 border-b border-border bg-background">
              <CardTitle>
                {modal.type === "quizSetField"
                  ? `Edit quiz set ${modal.field}`
                  : modal.type === "questionField"
                    ? `Edit question ${modal.questionIndex + 1} ${modal.field}`
                    : modal.type === "questionOption"
                      ? `Edit question ${modal.questionIndex + 1} option`
                      : `Edit full row question ${modal.questionIndex + 1}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                aria-label="Close"
                onClick={() => setModal(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              </CardHeader>
              <CardContent className="max-h-[78vh] space-y-6 overflow-y-auto bg-background pt-5">
              {modal.type === "quizSetField" ? (
                <div className="space-y-4">
                  {modal.field === "mode" ? (
                    <label className="grid gap-1 text-sm">
                      Mode
                      <select
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3"
                      >
                        <option value="jft-mockup">jft-mockup</option>
                        <option value="kisi-kisi">kisi-kisi</option>
                      </select>
                    </label>
                  ) : modal.field === "description" ? (
                    <label className="grid gap-1 text-sm">
                      Description
                      <textarea
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2"
                      />
                    </label>
                  ) : (
                    <label className="grid gap-1 text-sm">
                      Value
                      <input
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3"
                      />
                    </label>
                  )}
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button onClick={handleSaveQuizSetField} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : null}

              {modal.type === "questionField" ? (
                <div className="space-y-4">
                  {modal.field === "prompt" ? (
                    <label className="grid gap-1 text-sm">
                      Prompt
                      <textarea
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2"
                      />
                    </label>
                  ) : (
                    <label className="grid gap-1 text-sm">
                      Value
                      <input
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3"
                      />
                    </label>
                  )}
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button onClick={handleSaveQuestionField} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : null}

              {modal.type === "questionOption" && draftOption ? (
                <div className="space-y-4">
                  <label className="grid gap-1 text-sm">
                    Choice ID
                    <input
                      value={draftOption.id}
                      onChange={(event) =>
                        setDraftOption((prev) =>
                          prev ? { ...prev, id: event.target.value } : prev
                        )
                      }
                      className="h-10 rounded-md border border-input bg-background px-3"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    Option text
                    <textarea
                      value={draftOption.text}
                      onChange={(event) =>
                        setDraftOption((prev) =>
                          prev ? { ...prev, text: event.target.value } : prev
                        )
                      }
                      className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    Option image URL
                    <input
                      value={draftOption.imageUrl ?? ""}
                      onChange={(event) =>
                        setDraftOption((prev) =>
                          prev ? { ...prev, imageUrl: event.target.value || null } : prev
                        )
                      }
                      className="h-10 rounded-md border border-input bg-background px-3"
                    />
                  </label>
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button onClick={handleSaveQuestionOption} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : null}

              {modal.type === "questionRow" && draftQuestion ? (
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      Section
                      <input
                        value={draftQuestion.section}
                        onChange={(event) =>
                          setDraftQuestion((prev) =>
                            prev ? { ...prev, section: event.target.value } : prev
                          )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Answer ID
                      <input
                        value={draftQuestion.answerId}
                        onChange={(event) =>
                          setDraftQuestion((prev) =>
                            prev ? { ...prev, answerId: event.target.value } : prev
                          )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3"
                      />
                    </label>
                  </div>
                  <label className="grid gap-1 text-sm">
                    Prompt
                    <textarea
                      value={draftQuestion.prompt}
                      onChange={(event) =>
                        setDraftQuestion((prev) =>
                          prev ? { ...prev, prompt: event.target.value } : prev
                        )
                      }
                      className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    Question image URL
                    <input
                      value={draftQuestion.imageUrl ?? ""}
                      onChange={(event) =>
                        setDraftQuestion((prev) =>
                          prev ? { ...prev, imageUrl: event.target.value || null } : prev
                        )
                      }
                      className="h-10 rounded-md border border-input bg-background px-3"
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {draftQuestion.options.map((option, optionIndex) => (
                      <div
                        key={`${draftQuestion.id}-option-${option.id}`}
                        className="space-y-3 rounded-lg border border-border bg-muted/25 p-4"
                      >
                        <label className="grid gap-1 text-sm">
                          Choice ID
                          <input
                            value={option.id}
                            onChange={(event) =>
                              setDraftQuestion((prev) => {
                                if (!prev) return prev;
                                const nextOptions = [...prev.options];
                                nextOptions[optionIndex] = {
                                  ...nextOptions[optionIndex],
                                  id: event.target.value
                                };
                                return { ...prev, options: nextOptions };
                              })
                            }
                            className="h-9 rounded-md border border-input bg-background px-3"
                          />
                        </label>
                        <label className="grid gap-1 text-sm">
                          Option text
                          <input
                            value={option.text}
                            onChange={(event) =>
                              setDraftQuestion((prev) => {
                                if (!prev) return prev;
                                const nextOptions = [...prev.options];
                                nextOptions[optionIndex] = {
                                  ...nextOptions[optionIndex],
                                  text: event.target.value
                                };
                                return { ...prev, options: nextOptions };
                              })
                            }
                            className="h-9 rounded-md border border-input bg-background px-3"
                          />
                        </label>
                        <label className="grid gap-1 text-sm">
                          Option image URL
                          <input
                            value={option.imageUrl ?? ""}
                            onChange={(event) =>
                              setDraftQuestion((prev) => {
                                if (!prev) return prev;
                                const nextOptions = [...prev.options];
                                nextOptions[optionIndex] = {
                                  ...nextOptions[optionIndex],
                                  imageUrl: event.target.value || null
                                };
                                return { ...prev, options: nextOptions };
                              })
                            }
                            className="h-9 rounded-md border border-input bg-background px-3"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button onClick={handleSaveQuestionRow} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
