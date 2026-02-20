"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/ExportButton";
import type { QuizResult } from "@/types/quiz";

interface QuizHistoryListProps {
  history: QuizResult[];
}

export function QuizHistoryList({ history }: QuizHistoryListProps) {
  const [filter, setFilter] = useState<"all" | "jft-mockup" | "kisi-kisi">("all");

  const filtered = useMemo(() => {
    if (filter === "all") {
      return history;
    }
    return history.filter((item) => item.mode === filter);
  }, [filter, history]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "secondary" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={filter === "jft-mockup" ? "secondary" : "outline"}
          onClick={() => setFilter("jft-mockup")}
        >
          Mockup
        </Button>
        <Button
          size="sm"
          variant={filter === "kisi-kisi" ? "secondary" : "outline"}
          onClick={() => setFilter("kisi-kisi")}
        >
          Kisi-kisi
        </Button>
      </div>
      {filtered.map((item) => (
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
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              Score: {item.score} / 250 · Correct {item.correct} of {item.total}
            </div>
            <ExportButton result={item} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
