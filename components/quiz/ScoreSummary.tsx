import { Award, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreSummaryProps {
  correct: number;
  total: number;
}

export function ScoreSummary({ correct, total }: ScoreSummaryProps) {
  const score = total > 0 ? Math.round((correct / total) * 250) : 0;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <Card className="surface-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-warning" />
          Your score
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="text-4xl font-semibold text-foreground">{score} / 250</div>
        <Badge variant={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "destructive"} className="w-fit">
          <Target className="mr-1 h-3 w-3" />
          {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good effort" : "Needs review"}
        </Badge>
        <div>
          {correct} correct answers out of {total} ({percentage}%)
        </div>
      </CardContent>
    </Card>
  );
}
