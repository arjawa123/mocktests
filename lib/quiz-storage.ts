import type { QuizProgress, QuizResult } from "@/types/quiz";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchProgress, persistProgress, removeProgress } from "@/lib/supabase/progress";
import { fetchResults, persistResult } from "@/lib/supabase/results";

const HISTORY_KEY = "jft-quiz-history";

export async function loadProgress(quizId: string): Promise<QuizProgress | null> {
  if (isSupabaseConfigured) {
    return fetchProgress(quizId);
  }
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

export async function saveProgress(progress: QuizProgress) {
  if (isSupabaseConfigured) {
    await persistProgress(progress);
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(progressKey(progress.quizId), JSON.stringify(progress));
}

export async function clearProgress(quizId: string) {
  if (isSupabaseConfigured) {
    await removeProgress(quizId);
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(progressKey(quizId));
}

export async function loadHistory(): Promise<QuizResult[]> {
  if (isSupabaseConfigured) {
    return fetchResults();
  }
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

export async function saveResult(result: QuizResult) {
  if (isSupabaseConfigured) {
    await persistResult(result);
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  const history = await loadHistory();
  history.unshift(result);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

function progressKey(quizId: string) {
  return `jft-quiz-progress:${quizId}`;
}
