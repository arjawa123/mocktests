import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizNavigation({
  canGoBack,
  canGoNext,
  isLast,
  onBack,
  onNext,
  onFinish
}: QuizNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>
      {isLast ? (
        <Button variant="gradient" onClick={onFinish} disabled={!canGoNext}>
          <CheckCircle2 className="h-4 w-4" />
          Finish quiz
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext}>
          Next question
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
