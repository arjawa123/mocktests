import { Flag, Timer } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  current: number;
  total: number;
}

export function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const value = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-soft">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <Timer className="h-4 w-4 text-info" />
          {value}%
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}
