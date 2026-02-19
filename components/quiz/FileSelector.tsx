import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizFile, QuizProgress } from "@/types/quiz";

interface FileSelectorProps {
  files: QuizFile[];
  progressMap: Record<string, QuizProgress | null>;
  onStart: (file: QuizFile, resume: boolean) => void;
}

export function FileSelector({ files, progressMap, onStart }: FileSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {files.map((file) => {
        const progress = progressMap[file.id];
        return (
          <Card key={file.id}>
            <CardHeader>
              <CardTitle>{file.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{file.description}</p>
              {progress ? (
                <p>
                  Saved progress: question {progress.currentIndex + 1} of {progress.answers.length}
                </p>
              ) : (
                <p>No saved progress yet.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {progress ? (
                  <Button onClick={() => onStart(file, true)}>
                    Resume
                  </Button>
                ) : null}
                <Button variant="outline" onClick={() => onStart(file, false)}>
                  Start fresh
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
