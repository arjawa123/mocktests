"use client";

import type { QuizOption } from "@/types/quiz";

interface OptionEditorProps {
  option: QuizOption;
  onChange: (option: QuizOption) => void;
}

export function OptionEditor({ option, onChange }: OptionEditorProps) {
  return (
    <div className="grid gap-2 rounded-md border border-border p-3">
      <label className="grid gap-1 text-xs text-muted-foreground">
        Choice {option.id}
        <input
          value={option.text}
          onChange={(event) => onChange({ ...option, text: event.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3"
        />
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Image URL
        <input
          value={option.imageUrl ?? ""}
          onChange={(event) => onChange({ ...option, imageUrl: event.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3"
        />
      </label>
    </div>
  );
}
