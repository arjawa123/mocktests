import { BookMarked, PlayCircle, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizProgress, QuizSet } from "@/types/quiz";

interface FileSelectorProps {
  files: QuizSet[];
  progressMap: Record<string, QuizProgress | null>;
  onStart: (file: QuizSet, resume: boolean) => void;
}

export function FileSelector({ files, progressMap, onStart }: FileSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {files.map((file) => {
        const progress = progressMap[file.id];
        return (
          <Card key={file.id} className="group surface-gradient">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-primary" />
                  {file.name}
                </CardTitle>
                <Badge variant={file.mode === "jft-mockup" ? "info" : "success"}>
                  {file.mode}
                </Badge>
              </div>
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
                    <RotateCcw className="h-4 w-4" />
                    Resume
                  </Button>
                ) : null}
                <Button variant="outline" onClick={() => onStart(file, false)}>
                  <PlayCircle className="h-4 w-4" />
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
