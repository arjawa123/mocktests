import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizQuestion } from "@/types/quiz";

interface SectionNavigatorProps {
  questions: QuizQuestion[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export function SectionNavigator({ questions, currentIndex, onJump }: SectionNavigatorProps) {
  const sections = questions.reduce<
    { name: string; startIndex: number; count: number }[]
  >((acc, question, index) => {
    const last = acc[acc.length - 1];
    if (!last || last.name !== question.section) {
      acc.push({ name: question.section, startIndex: index, count: 1 });
    } else {
      last.count += 1;
    }
    return acc;
  }, []);

  return (
    <Card className="flex flex-wrap gap-3 p-4 text-sm">
      {sections.map((section) => {
        const isActive =
          currentIndex >= section.startIndex &&
          currentIndex < section.startIndex + section.count;
        return (
          <Button
            key={section.name}
            variant={isActive ? "secondary" : "outline"}
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
    </Card>
  );
}
