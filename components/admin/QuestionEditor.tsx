"use client";

import { OptionEditor } from "@/components/admin/OptionEditor";
import type { QuizQuestion } from "@/types/quiz";

interface QuestionEditorProps {
  question: QuizQuestion;
  onChange: (question: QuizQuestion) => void;
}

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Section
          <input
            value={question.section}
            onChange={(event) => onChange({ ...question, section: event.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3"
          />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Correct answer ID
          <input
            value={question.answerId}
            onChange={(event) => onChange({ ...question, answerId: event.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3"
          />
        </label>
      </div>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Prompt
        <textarea
          value={question.prompt}
          onChange={(event) => onChange({ ...question, prompt: event.target.value })}
          className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Question image URL
        <input
          value={question.imageUrl ?? ""}
          onChange={(event) => onChange({ ...question, imageUrl: event.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        {question.options.map((option, index) => (
          <OptionEditor
            key={option.id}
            option={option}
            onChange={(updated) => {
              const options = [...question.options];
              options[index] = updated;
              onChange({ ...question, options });
            }}
          />
        ))}
      </div>
    </div>
  );
}
