import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizQuestion } from "@/types/quiz";

interface SectionNavigatorProps {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (string | null)[];
  onJump: (index: number) => void;
}

export function SectionNavigator({
  questions,
  currentIndex,
  answers,
  onJump
}: SectionNavigatorProps) {
  const sections = questions.reduce<
    { name: string; startIndex: number; count: number; indices: number[] }[]
  >((acc, question, index) => {
    const last = acc[acc.length - 1];
    if (!last || last.name !== question.section) {
      acc.push({
        name: question.section,
        startIndex: index,
        count: 1,
        indices: [index]
      });
    } else {
      last.count += 1;
      last.indices.push(index);
    }
    return acc;
  }, []);

  const activeSection =
    sections.find(
      (section) =>
        currentIndex >= section.startIndex &&
        currentIndex < section.startIndex + section.count
    ) ?? sections[0];

  return (
    <Card className="space-y-4 border-dashed p-4 text-sm">
      <div className="flex flex-wrap gap-3">
        {sections.map((section) => {
          const isActive =
            currentIndex >= section.startIndex &&
            currentIndex < section.startIndex + section.count;
          return (
            <Button
              key={section.name}
              variant={isActive ? "gradient" : "outline"}
              size="sm"
              onClick={() => onJump(section.startIndex)}
            >
              <span>{section.name}</span>
              <Badge variant="outline" className="ml-2">
                {section.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {activeSection ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Pilih nomor soal ({activeSection.name})
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSection.indices.map((index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = Boolean(answers[index]);

              return (
                <Button
                  key={`${activeSection.name}-${index}`}
                  size="sm"
                  variant={isCurrent ? "default" : "outline"}
                  className={isAnswered && !isCurrent ? "border-success/40 text-success" : undefined}
                  onClick={() => onJump(index)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
