import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuizQuestion } from "@/types/quiz";

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  selectedAnswer: string | null;
  onSelect: (answerId: string) => void;
}

export function QuestionCard({
  question,
  index,
  selectedAnswer,
  onSelect
}: QuestionCardProps) {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{question.section}</Badge>
          <span className="text-xs text-muted-foreground">Question {index + 1}</span>
          <Sparkles className="ml-auto h-4 w-4 text-warning" />
        </div>
        <CardTitle className="text-base leading-relaxed sm:text-lg">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.imageUrl ? (
          <img
            src={question.imageUrl}
            alt="Question visual"
            className="max-h-72 w-full rounded-xl border border-border/60 bg-background/40 object-contain p-2"
          />
        ) : null}
        <RadioGroup>
          {question.options.map((option) => (
            <RadioGroupItem
              key={option.id}
              checked={selectedAnswer === option.id}
              onClick={() => onSelect(option.id)}
            >
              <span className="font-semibold text-muted-foreground">{option.id}</span>
              <div className="space-y-2">
                <span>{option.text}</span>
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={`Option ${option.id}`}
                    className="max-h-40 w-full rounded-md border border-border object-contain"
                  />
                ) : null}
              </div>
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
