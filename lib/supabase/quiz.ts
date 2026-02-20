import { loadQuizQuestions } from "@/lib/data-loader";
import { quizFiles } from "@/lib/data-manifest";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { QuizMode, QuizQuestion, QuizSet } from "@/types/quiz";

interface SupabaseQuestionRow {
  id: string;
  section: string;
  prompt: string;
  image_url: string | null;
  answer_id: string;
  number: number;
}

interface SupabaseOptionRow {
  id: string;
  question_id: string;
  choice_id: string;
  text: string;
  image_url: string | null;
  order_index: number | null;
}

interface SupabaseAssetRow {
  question_id: string;
  asset_type: string;
  url: string;
}

export async function fetchQuizSets(mode?: QuizMode): Promise<QuizSet[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mode ? quizFiles.filter((file) => file.mode === mode) : quizFiles;
  }

  const query = supabase.from("quiz_sets").select("*");
  const { data, error } = mode
    ? await query.eq("mode", mode).order("created_at", { ascending: false })
    : await query.order("created_at", { ascending: false });

  if (error || !data) {
    return mode ? quizFiles.filter((file) => file.mode === mode) : quizFiles;
  }

  return data.map((item: any) => ({
    id: item.id,
    mode: item.mode,
    name: item.name,
    description: item.description ?? undefined,
    level: item.level ?? null,
    fileName: item.file_name ?? undefined
  }));
}

export async function fetchQuizQuestions(quizSet: QuizSet): Promise<QuizQuestion[]> {
  if (!isSupabaseConfigured || !supabase) {
    return loadQuizQuestions(quizSet);
  }

  const { data: questions, error } = await supabase
    .from("quiz_questions")
    .select("id, section, prompt, image_url, answer_id, number")
    .eq("quiz_set_id", quizSet.id)
    .order("number", { ascending: true });

  if (error || !questions) {
    return loadQuizQuestions(quizSet);
  }

  if (questions.length === 0) {
    return [];
  }

  const questionIds = questions.map((question) => question.id);
  const [{ data: options }, { data: assets }] = await Promise.all([
    supabase
      .from("quiz_options")
      .select("id, question_id, choice_id, text, image_url, order_index")
      .in("question_id", questionIds)
      .order("order_index", { ascending: true }),
    supabase
      .from("quiz_assets")
      .select("question_id, asset_type, url")
      .in("question_id", questionIds)
  ]);

  const optionsByQuestion = (options ?? []).reduce<Record<string, SupabaseOptionRow[]>>(
    (acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      acc[option.question_id].push(option as SupabaseOptionRow);
      return acc;
    },
    {}
  );

  const assetsByQuestion = (assets ?? []).reduce<Record<string, SupabaseAssetRow[]>>(
    (acc, asset) => {
      if (!acc[asset.question_id]) {
        acc[asset.question_id] = [];
      }
      acc[asset.question_id].push(asset as SupabaseAssetRow);
      return acc;
    },
    {}
  );

  return (questions as SupabaseQuestionRow[]).map((question) => {
    const questionOptions = optionsByQuestion[question.id] ?? [];
    const audioAssets = (assetsByQuestion[question.id] ?? [])
      .filter((asset) => asset.asset_type === "audio")
      .map((asset) => asset.url);

    return {
      id: question.id,
      section: question.section,
      prompt: question.prompt,
      options: questionOptions.map((option) => ({
        id: option.choice_id,
        text: option.text,
        imageUrl: option.image_url
      })),
      answerId: question.answer_id,
      assetUrls: audioAssets,
      imageUrl: question.image_url
    };
  });
}
