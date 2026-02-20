import { CheckCircle2, CircleX } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizQuestion } from "@/types/quiz";

interface ReviewPanelProps {
  questions: QuizQuestion[];
  answers: (string | null)[];
}

export function ReviewPanel({ questions, answers }: ReviewPanelProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const selected = answers[index];
        const isCorrect = selected === question.answerId;
        const correctOption = question.options.find(
          (option) => option.id === question.answerId
        );
        const selectedOption = question.options.find(
          (option) => option.id === selected
        );

        return (
          <Card key={question.id} className="animate-fade-in">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={isCorrect ? "success" : "destructive"}>
                  {question.section}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Question {index + 1}
                </span>
              </div>
              <CardTitle className="text-base leading-relaxed">
                {question.prompt}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant={isCorrect ? "success" : "destructive"}>
                <AlertTitle>
                  <span className="inline-flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <CircleX className="h-4 w-4" />
                    )}
                    {isCorrect ? "Correct" : "Needs review"}
                  </span>
                </AlertTitle>
                <AlertDescription>
                  {selectedOption
                    ? `Your answer: ${selectedOption.text}`
                    : "No answer selected."}
                </AlertDescription>
              </Alert>
              <div className="rounded-md border border-border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Correct answer</p>
                <p className="font-medium">
                  {correctOption ? correctOption.text : question.answerId}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
