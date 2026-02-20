import type { QuizQuestion, QuizSet } from "@/types/quiz";

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

export async function loadQuizQuestions(file: QuizSet): Promise<QuizQuestion[]> {
  if (!file.fileName) {
    throw new Error("Missing quiz file reference.");
  }
  const response = await fetch(`/data/${file.fileName}`);
  if (!response.ok) {
    throw new Error("Failed to load quiz data.");
  }
  const data = await response.json();
  return file.mode === "jft-mockup"
    ? transformMockTest(data as MockTestFile)
    : transformKisiKisi(data as KisiKisiItem[]);
}

function transformMockTest(data: MockTestFile): QuizQuestion[] {
  return data.items
    .filter(
      (item) =>
        item.question &&
        item.answer &&
        Array.isArray(item.options) &&
        item.options.length > 0
    )
    .map((item) => ({
      id: `mock-${item.number}`,
      section: item.section ?? "Mock Test",
      prompt: item.question ?? "",
      options: item.options.map((option) => ({
        id: option.choice,
        text: option.text
      })),
      answerId: item.answer ?? "",
      assetUrls: item.assetUrls ?? []
    }));
}

function transformKisiKisi(items: KisiKisiItem[]): QuizQuestion[] {
  return items
    .filter(
      (item) =>
        item.question &&
        item.correct_answer &&
        Array.isArray(item.options) &&
        item.options.length > 0
    )
    .map((item) => {
      const uniqueOptionTexts = getUniqueOptionTexts(item.options);
      const matchIndex = uniqueOptionTexts.findIndex(
        (option) => normalizeText(option) === normalizeText(item.correct_answer)
      );
      const normalizedAnswer = item.correct_answer.trim();
      const optionTexts =
        matchIndex >= 0 ? uniqueOptionTexts : [...uniqueOptionTexts, normalizedAnswer];

      const options = optionTexts.map((text, index) => ({
        id: String.fromCharCode(65 + index),
        text
      }));
      const answerIndex = optionTexts.findIndex(
        (option) => normalizeText(option) === normalizeText(normalizedAnswer)
      );
      const answerId = answerIndex >= 0 ? options[answerIndex].id : options[0]?.id ?? "";
      return {
        id: `kisi-${item.index}`,
        section: "Kisi-kisi",
        prompt: item.question,
        options,
        answerId,
        imageUrl: item.image
      };
    });
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
