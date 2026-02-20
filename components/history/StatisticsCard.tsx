import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsCardProps {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
}

export function StatisticsCard({ totalQuizzes, averageScore, bestScore }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div>Total quizzes completed: {totalQuizzes}</div>
        <div>Average score: {averageScore} / 250</div>
        <div>Best score: {bestScore} / 250</div>
      </CardContent>
    </Card>
  );
}
