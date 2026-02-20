import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SectionBreakdownProps {
  breakdown: { section: string; correct: number; total: number }[];
}

export function SectionBreakdown({ breakdown }: SectionBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakdown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No section data yet.</p>
        ) : (
          breakdown.map((section) => {
            const percentage = section.total
              ? Math.round((section.correct / section.total) * 100)
              : 0;
            return (
              <div key={section.section} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{section.section}</span>
                  <span className="text-muted-foreground">
                    {section.correct}/{section.total} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
