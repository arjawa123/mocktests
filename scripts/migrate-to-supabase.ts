import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

import { quizFiles } from "@/lib/data-manifest";

interface MockTestOption {
  choice: string;
  text: string;
}

interface MockTestItem {
  number: number;
  section: string;
  question: string | null;
  options: MockTestOption[];
  answer: string | null;
  assetUrls?: string[];
}

interface MockTestFile {
  mocktestName: string;
  level: string;
  items: MockTestItem[];
}

interface KisiKisiItem {
  index: number;
  question: string;
  image: string | null;
  options: string[];
  correct_answer: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceKey) {
  throw new Error("Supabase credentials are missing. Add env vars before running.");
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  for (const file of quizFiles) {
    if (!file.fileName) {
      continue;
    }
    const filePath = path.join(process.cwd(), "public", "data", file.fileName);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    await supabase
      .from("quiz_sets")
      .upsert({
        id: file.id,
        mode: file.mode,
        name: file.name,
        description: file.description,
        file_name: file.fileName
      });

    if (file.mode === "jft-mockup") {
      const mockTest = data as MockTestFile;
      const questions = mockTest.items
        .filter((item) => item.question && item.answer)
        .map((item) => ({
          id: `${file.id}-${item.number}`,
          quiz_set_id: file.id,
          number: item.number,
          section: item.section,
          prompt: item.question,
          answer_id: item.answer,
          image_url: null
        }));

      if (questions.length > 0) {
        await supabase.from("quiz_questions").upsert(questions);
      }

      const options = mockTest.items.flatMap((item) =>
        item.options.map((option, index) => ({
          question_id: `${file.id}-${item.number}`,
          choice_id: option.choice,
          text: option.text,
          image_url: null,
          order_index: index
        }))
      );

      if (options.length > 0) {
        await supabase.from("quiz_options").upsert(options);
      }

      const assets = mockTest.items.flatMap((item) =>
        (item.assetUrls ?? []).map((url) => ({
          question_id: `${file.id}-${item.number}`,
          asset_type: "audio",
          url
        }))
      );

      if (assets.length > 0) {
        await supabase.from("quiz_assets").upsert(assets);
      }
    } else {
      const kisiItems = data as KisiKisiItem[];
      const normalized = kisiItems.map((item) => {
        const uniqueOptions = getUniqueOptionTexts(item.options);
        const normalizedAnswer = item.correct_answer.trim();
        const matchIndex = uniqueOptions.findIndex(
          (option) => normalizeText(option) === normalizeText(normalizedAnswer)
        );
        const optionTexts =
          matchIndex >= 0 ? uniqueOptions : [...uniqueOptions, normalizedAnswer];
        const options = optionTexts.map((option, index) => ({
          choice: String.fromCharCode(65 + index),
          text: option
        }));
        const answerIndex = optionTexts.findIndex(
          (option) => normalizeText(option) === normalizeText(normalizedAnswer)
        );
        const answerId = answerIndex >= 0 ? options[answerIndex].choice : options[0].choice;

        return {
          item,
          options,
          answerId
        };
      });

      const questions = normalized.map(({ item, answerId }) => ({
        id: `${file.id}-${item.index}`,
        quiz_set_id: file.id,
        number: item.index,
        section: "Kisi-kisi",
        prompt: item.question,
        answer_id: answerId,
        image_url: item.image
      }));
      await supabase.from("quiz_questions").upsert(questions);

      const options = normalized.flatMap(({ item, options }) =>
        options.map((option, index) => ({
          question_id: `${file.id}-${item.index}`,
          choice_id: option.choice,
          text: option.text,
          image_url: null,
          order_index: index
        }))
      );
      await supabase.from("quiz_options").upsert(options);
    }
  }
}

function getUniqueOptionTexts(options: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  options.forEach((option) => {
    const normalized = normalizeText(option);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    unique.push(option.trim());
  });

  return unique;
}

function normalizeText(value: string) {
  return value.trim();
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
