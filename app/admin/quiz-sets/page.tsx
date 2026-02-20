"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAdminQuizSets } from "@/lib/supabase/admin";
import type { QuizSet } from "@/types/quiz";

export default function AdminQuizSetsPage() {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAdminQuizSets();
      setQuizSets(data);
    };
    load();
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Quiz sets</h2>
        <Button asChild>
          <Link href="/admin/quiz-sets/new">Create quiz set</Link>
        </Button>
      </div>
      {quizSets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No quiz sets found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add your first quiz set to start managing questions.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizSets.map((set) => (
            <Card key={set.id}>
              <CardHeader>
                <CardTitle>{set.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <div>
                  <div>Mode: {set.mode === "jft-mockup" ? "JFT Mockup" : "Kisi-kisi"}</div>
                  {set.description ? <div>{set.description}</div> : null}
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/admin/quiz-sets/${set.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
