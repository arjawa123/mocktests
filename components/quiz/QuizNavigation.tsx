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
        Previous
      </Button>
      {isLast ? (
        <Button onClick={onFinish} disabled={!canGoNext}>
          Finish quiz
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext}>
          Next question
        </Button>
      )}
    </div>
  );
}
