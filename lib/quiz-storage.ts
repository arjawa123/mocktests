import type { QuizProgress, QuizResult } from "@/types/quiz";

const HISTORY_KEY = "jft-quiz-history";

export function loadProgress(quizId: string): QuizProgress | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(progressKey(quizId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as QuizProgress;
  } catch {
    return null;
  }
}

export function saveProgress(progress: QuizProgress) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(progressKey(progress.quizId), JSON.stringify(progress));
}

export function clearProgress(quizId: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(progressKey(quizId));
}

export function loadHistory(): QuizResult[] {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as QuizResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: QuizResult) {
  if (typeof window === "undefined") {
    return;
  }
  const history = loadHistory();
  history.unshift(result);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

function progressKey(quizId: string) {
  return `jft-quiz-progress:${quizId}`;
}
