import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user-session";
import type { QuizResult } from "@/types/quiz";

export async function fetchResults(): Promise<QuizResult[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", getUserId())
    .order("completed_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item: any) => ({
    quizId: item.quiz_id,
    mode: item.mode,
    fileName: item.file_name,
    score: item.score,
    correct: item.correct,
    total: item.total,
    completedAt: item.completed_at,
    answers: item.answers,
    sectionScores: item.section_scores ?? undefined
  }));
}

export async function persistResult(result: QuizResult) {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  await supabase.from("quiz_results").insert({
    quiz_id: result.quizId,
    user_id: getUserId(),
    mode: result.mode,
    file_name: result.fileName,
    score: result.score,
    correct: result.correct,
    total: result.total,
    answers: result.answers,
    section_scores: result.sectionScores,
    completed_at: result.completedAt
  });
}
