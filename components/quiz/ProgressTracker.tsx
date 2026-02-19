import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  current: number;
  total: number;
}

export function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const value = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
