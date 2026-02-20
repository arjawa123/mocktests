"use client";

import Link from "next/link";
import { useState } from "react";

import { QuizSetForm } from "@/components/admin/QuizSetForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createQuizSet } from "@/lib/supabase/admin";

export default function AdminQuizSetNewPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (values: {
    name: string;
    mode: "jft-mockup" | "kisi-kisi";
    description?: string;
    level?: string | null;
  }) => {
    setIsSaving(true);
    const created = await createQuizSet(values);
    setIsSaving(false);
    setMessage(created ? "Quiz set created successfully." : "Failed to create quiz set.");
  };

  return (
    <div className="grid gap-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/quiz-sets">← Back to quiz sets</Link>
      </Button>
      {!isSupabaseConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Supabase not configured</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add your Supabase credentials in .env.local to enable admin creation.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create new quiz set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuizSetForm
              initialValues={{ name: "", mode: "jft-mockup", description: "", level: "" }}
              onSave={handleSave}
              isSaving={isSaving}
            />
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
