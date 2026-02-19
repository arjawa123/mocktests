"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadHistory } from "@/lib/quiz-storage";
import type { QuizResult } from "@/types/quiz";

export default function HistoryPage() {
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <main className="container min-h-screen space-y-8 py-10">
      <header className="space-y-3">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Progress history</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of your recent scores and completed quizzes.
        </p>
      </header>

      {history.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No quiz history yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complete a quiz to see your progress recorded here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {history.map((item) => (
            <Card key={`${item.quizId}-${item.completedAt}`}>
              <CardHeader className="space-y-2">
                <CardTitle>{item.fileName}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {item.mode === "jft-mockup" ? "Mockup" : "Kisi-kisi"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.completedAt).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Score: {item.score} / 250 · Correct {item.correct} of {item.total}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
