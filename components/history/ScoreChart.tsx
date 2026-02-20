"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizResult } from "@/types/quiz";

interface ScoreChartProps {
  results: QuizResult[];
}

export function ScoreChart({ results }: ScoreChartProps) {
  const data = [...results]
    .reverse()
    .map((result) => ({
      date: new Date(result.completedAt).toLocaleDateString(),
      score: result.score
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 250]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
