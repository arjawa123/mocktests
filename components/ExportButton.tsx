"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { exportResultsToCSV, exportResultsToJSON, shareResults } from "@/lib/export";
import type { QuizResult } from "@/types/quiz";

interface ExportButtonProps {
  result: QuizResult;
}

export function ExportButton({ result }: ExportButtonProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      const shared = await shareResults(result);
      if (!shared) {
        setShareMessage("Sharing is not supported in this browser.");
      }
    } catch {
      setShareMessage("Unable to share right now.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => exportResultsToJSON(result)}>
        Export JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => exportResultsToCSV(result)}>
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        Share
      </Button>
      {shareMessage ? (
        <span className="text-xs text-muted-foreground">{shareMessage}</span>
      ) : null}
    </div>
  );
}
