import type { QuizResult } from "@/types/quiz";

export function exportResultsToJSON(result: QuizResult) {
  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: "application/json"
  });
  downloadBlob(blob, `jft-result-${result.quizId}.json`);
}

export function exportResultsToCSV(result: QuizResult) {
  const rows = [
    ["Quiz", result.fileName],
    ["Mode", result.mode],
    ["Score", result.score],
    ["Correct", result.correct],
    ["Total", result.total],
    ["Completed", result.completedAt]
  ];

  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  downloadBlob(blob, `jft-result-${result.quizId}.csv`);
}

export async function shareResults(result: QuizResult) {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }
  const summary = `JFT Quiz result: ${result.score}/250 (${result.correct}/${result.total})`;
  await navigator.share({
    title: "JFT Quiz Result",
    text: summary
  });
  return true;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
