import { fetchQuizQuestions, fetchQuizSets } from "@/lib/supabase/quiz";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { QuizSet } from "@/types/quiz";

interface QuizSetInput {
  mode: QuizSet["mode"];
  name: string;
  description?: string;
  level?: string | null;
}

interface QuestionUpdate {
  prompt: string;
  section: string;
  answerId: string;
  imageUrl?: string | null;
}

interface OptionUpdate {
  choiceId: string;
  text: string;
  imageUrl?: string | null;
  orderIndex: number;
}

export async function fetchAdminQuizSets(): Promise<QuizSet[]> {
  return fetchQuizSets();
}

export async function fetchAdminQuizSetDetail(quizSetId: string) {
  const quizSets = await fetchQuizSets();
  const quizSet = quizSets.find((set) => set.id === quizSetId) ?? null;
  const questions = quizSet ? await fetchQuizQuestions(quizSet) : [];
  return { quizSet, questions };
}

export async function createQuizSet(payload: QuizSetInput): Promise<QuizSet | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("quiz_sets")
    .insert({
      mode: payload.mode,
      name: payload.name,
      description: payload.description,
      level: payload.level
    })
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    mode: data.mode,
    name: data.name,
    description: data.description ?? undefined,
    level: data.level ?? null
  };
}

export async function updateQuizSet(quizSetId: string, payload: QuizSetInput) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { error } = await supabase
    .from("quiz_sets")
    .update({
      mode: payload.mode,
      name: payload.name,
      description: payload.description,
      level: payload.level
    })
    .eq("id", quizSetId);

  return !error;
}

export async function updateQuestion(questionId: string, payload: QuestionUpdate) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { error } = await supabase
    .from("quiz_questions")
    .update({
      prompt: payload.prompt,
      section: payload.section,
      answer_id: payload.answerId,
      image_url: payload.imageUrl ?? null
    })
    .eq("id", questionId);

  return !error;
}

export async function upsertOptions(questionId: string, options: OptionUpdate[]) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { error } = await supabase
    .from("quiz_options")
    .upsert(
      options.map((option) => ({
        question_id: questionId,
        choice_id: option.choiceId,
        text: option.text,
        image_url: option.imageUrl ?? null,
        order_index: option.orderIndex
      }))
    );

  return !error;
}
