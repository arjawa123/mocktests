export type QuizMode = "jft-mockup" | "kisi-kisi";

export interface QuizSet {
  id: string;
  mode: QuizMode;
  name: string;
  description?: string;
  level?: string | null;
  fileName?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string | null;
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

export interface SectionScore {
  section: string;
  correct: number;
  total: number;
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
  sectionScores?: SectionScore[];
}
