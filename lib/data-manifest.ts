import type { QuizFile, QuizMode } from "@/types/quiz";

export const quizFiles: QuizFile[] = [
  {
    id: "mocktest2",
    mode: "jft-mockup",
    label: "JFT Mock Test 2",
    fileName: "jft_mocktest2_final_v3.json",
    description: "Full mock test with 50 questions."
  },
  {
    id: "midlevel6",
    mode: "jft-mockup",
    label: "JFT Mid Level Mock Test 6",
    fileName: "jft_mid_level_mock_test_6.json",
    description: "Mid level mock test with audio sections."
  },
  {
    id: "kuroi-review",
    mode: "kisi-kisi",
    label: "Kuroi Review Set",
    fileName: "jft_kuroi_review.json",
    description: "Kisi-kisi review questions for quick drills."
  }
];

export function getQuizFilesByMode(mode: QuizMode) {
  return quizFiles.filter((file) => file.mode === mode);
}
