import type { QuizFile, QuizQuestion } from "@/types/quiz";

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

export async function loadQuizQuestions(file: QuizFile): Promise<QuizQuestion[]> {
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
    .filter((item) => item.question && item.correct_answer && item.options)
    .map((item) => {
      const options = item.options.map((text, index) => ({
        id: String.fromCharCode(65 + index),
        text
      }));
      const matchIndex = item.options.findIndex(
        (option) => option === item.correct_answer
      );
      const answerId = matchIndex >= 0 ? options[matchIndex].id : item.correct_answer;
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
