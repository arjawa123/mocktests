import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

import { quizFiles } from "../lib/data-manifest.ts";

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
  let migratedSets = 0;
  let migratedQuestions = 0;
  let migratedOptions = 0;
  let migratedAssets = 0;

  // eslint-disable-next-line no-console
  console.log(`Starting migration for ${quizFiles.length} quiz set(s)...`);

  for (const file of quizFiles) {
    if (!file.fileName) {
      continue;
    }
    // eslint-disable-next-line no-console
    console.log(`\nMigrating set: ${file.id} (${file.fileName})`);
    const filePath = path.join(process.cwd(), "public", "data", file.fileName);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    await upsertOrThrow("quiz_sets", {
      id: file.id,
      mode: file.mode,
      name: file.name,
      description: file.description,
      file_name: file.fileName
    });
    migratedSets += 1;

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
        await upsertOrThrow("quiz_questions", questions);
        migratedQuestions += questions.length;
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
        await upsertOrThrow("quiz_options", options);
        migratedOptions += options.length;
      }

      const assets = mockTest.items.flatMap((item) =>
        (item.assetUrls ?? []).map((url) => ({
          question_id: `${file.id}-${item.number}`,
          asset_type: "audio",
          url
        }))
      );

      if (assets.length > 0) {
        await upsertOrThrow("quiz_assets", assets);
        migratedAssets += assets.length;
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
      await upsertOrThrow("quiz_questions", questions);
      migratedQuestions += questions.length;

      const options = normalized.flatMap(({ item, options }) =>
        options.map((option, index) => ({
          question_id: `${file.id}-${item.index}`,
          choice_id: option.choice,
          text: option.text,
          image_url: null,
          order_index: index
        }))
      );
      await upsertOrThrow("quiz_options", options);
      migratedOptions += options.length;
    }

    // eslint-disable-next-line no-console
    console.log(`Done: ${file.id}`);
  }

  // eslint-disable-next-line no-console
  console.log("\nMigration completed.");
  // eslint-disable-next-line no-console
  console.log(
    `Summary: sets=${migratedSets}, questions=${migratedQuestions}, options=${migratedOptions}, assets=${migratedAssets}`
  );
}

async function upsertOrThrow<T>(table: string, payload: T | T[]) {
  const { error } = await supabase.from(table).upsert(payload);
  if (error) {
    throw new Error(`[${table}] ${error.message}`);
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
