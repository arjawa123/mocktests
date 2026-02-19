import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreSummaryProps {
  correct: number;
  total: number;
}

export function ScoreSummary({ correct, total }: ScoreSummaryProps) {
  const score = total > 0 ? Math.round((correct / total) * 250) : 0;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your score</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="text-3xl font-semibold text-foreground">{score} / 250</div>
        <div>
          {correct} correct answers out of {total} ({percentage}%)
        </div>
      </CardContent>
    </Card>
  );
}
