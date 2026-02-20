import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user-session";
import type { QuizProgress } from "@/types/quiz";

export async function fetchProgress(quizId: string): Promise<QuizProgress | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("user_id", getUserId())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    quizId: data.quiz_id,
    mode: data.mode,
    fileName: data.file_name,
    currentIndex: data.current_index,
    answers: data.answers,
    startedAt: data.started_at,
    updatedAt: data.updated_at
  } as QuizProgress;
}

export async function persistProgress(progress: QuizProgress) {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  await supabase.from("user_progress").upsert({
    quiz_id: progress.quizId,
    user_id: getUserId(),
    mode: progress.mode,
    file_name: progress.fileName,
    current_index: progress.currentIndex,
    answers: progress.answers,
    started_at: progress.startedAt,
    updated_at: progress.updatedAt
  });
}

export async function removeProgress(quizId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  await supabase
    .from("user_progress")
    .delete()
    .eq("quiz_id", quizId)
    .eq("user_id", getUserId());
}
