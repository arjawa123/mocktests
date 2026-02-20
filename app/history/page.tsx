"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ScoreChart } from "@/components/history/ScoreChart";
import { SectionBreakdown } from "@/components/history/SectionBreakdown";
import { StatisticsCard } from "@/components/history/StatisticsCard";
import { QuizHistoryList } from "@/components/history/QuizHistoryList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadHistory } from "@/lib/quiz-storage";
import type { QuizResult } from "@/types/quiz";

export default function HistoryPage() {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const results = await loadHistory();
      setHistory(results);
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalQuizzes = history.length;
    const averageScore = totalQuizzes
      ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes ? Math.max(...history.map((item) => item.score)) : 0;

    const sectionMap = new Map<string, { correct: number; total: number }>();
    history.forEach((result) => {
      result.sectionScores?.forEach((section) => {
        const existing = sectionMap.get(section.section) ?? { correct: 0, total: 0 };
        existing.correct += section.correct;
        existing.total += section.total;
        sectionMap.set(section.section, existing);
      });
    });

    const sectionBreakdown = Array.from(sectionMap.entries()).map(([section, data]) => ({
      section,
      correct: data.correct,
      total: data.total
    }));

    return { totalQuizzes, averageScore, bestScore, sectionBreakdown };
  }, [history]);

  return (
    <main className="container min-h-screen space-y-8 py-10">
      <header className="space-y-3">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Progress history</h1>
        <p className="text-sm text-muted-foreground">
          Track your recent scores, section performance, and exported results.
        </p>
      </header>

      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading history...</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fetching saved quiz results.
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
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
          <div className="grid gap-6 lg:grid-cols-3">
            <StatisticsCard
              totalQuizzes={stats.totalQuizzes}
              averageScore={stats.averageScore}
              bestScore={stats.bestScore}
            />
            <SectionBreakdown breakdown={stats.sectionBreakdown} />
            <ScoreChart results={history} />
          </div>
          <QuizHistoryList history={history} />
        </div>
      )}
    </main>
  );
}
