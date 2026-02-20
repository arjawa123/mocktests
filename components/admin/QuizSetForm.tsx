"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { QuizMode } from "@/types/quiz";

interface QuizSetFormValues {
  name: string;
  mode: QuizMode;
  description?: string;
  level?: string | null;
}

interface QuizSetFormProps {
  initialValues: QuizSetFormValues;
  onSave: (values: QuizSetFormValues) => void | Promise<void>;
  isSaving?: boolean;
}

export function QuizSetForm({ initialValues, onSave, isSaving }: QuizSetFormProps) {
  const [values, setValues] = useState<QuizSetFormValues>(initialValues);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="grid gap-1 text-sm">
        Quiz name
        <input
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        Mode
        <select
          value={values.mode}
          onChange={(event) =>
            setValues({ ...values, mode: event.target.value as QuizMode })
          }
          className="h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="jft-mockup">JFT Mockup</option>
          <option value="kisi-kisi">Kisi-kisi</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        Description
        <textarea
          value={values.description ?? ""}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Level
        <input
          value={values.level ?? ""}
          onChange={(event) => setValues({ ...values, level: event.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3"
        />
      </label>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save quiz set"}
      </Button>
    </form>
  );
}
