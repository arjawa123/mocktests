export type QuizMode = "jft-mockup" | "kisi-kisi";

export interface QuizFile {
  id: string;
  mode: QuizMode;
  label: string;
  fileName: string;
  description?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  prompt: string;
  options: QuizOption[];
  answerId: string;
  assetUrls?: string[];
  imageUrl?: string | null;
}

export interface QuizProgress {
  quizId: string;
  mode: QuizMode;
  fileName: string;
  currentIndex: number;
  answers: (string | null)[];
  startedAt: string;
  updatedAt: string;
}

export interface QuizResult {
  quizId: string;
  mode: QuizMode;
  fileName: string;
  score: number;
  correct: number;
  total: number;
  completedAt: string;
  answers: (string | null)[];
}
