import type { QuizMode, QuizSet } from "@/types/quiz";

export const quizFiles: QuizSet[] = [
  {
    id: "mocktest2",
    mode: "jft-mockup",
    name: "JFT Mock Test 2",
    fileName: "jft_mocktest2_final_v3.json",
    description: "Full mock test with 50 questions."
  },
  {
    id: "midlevel6",
    mode: "jft-mockup",
    name: "JFT Mid Level Mock Test 6",
    fileName: "jft_mid_level_mock_test_6.json",
    description: "Mid level mock test with audio sections."
  },
  {
    id: "jitensha-review",
    mode: "kisi-kisi",
    name: "Jitensha Review Set",
    fileName: "jft_jitensha_review.json",
    description: "Kisi-kisi review questions for quick drills."
  },
  {
    id: "saifu-review",
    mode: "kisi-kisi",
    name: "Saifu Review Set",
    fileName: "jft_saifu_review.json",
    description: "Kisi-kisi review questions for quick drills."
  },
  {
    id: "kudamono-review",
    mode: "kisi-kisi",
    name: "Kudamono Review Set",
    fileName: "jft_kudamono_review.json",
    description: "Kisi-kisi review questions for quick drills."
  },
  {
    id: "kuroi-review",
    mode: "kisi-kisi",
    name: "Kuroi Review Set",
    fileName: "jft_kuroi_review.json",
    description: "Kisi-kisi review questions for quick drills."
  },
  {
    id: "kutsushita-review",
    mode: "kisi-kisi",
    name: "Kutsushita Review Set",
    fileName: "jft_kutsushita_review.json",
    description: "Kisi-kisi review questions for quick drills."
  },
  {
    id: "okimasu-review",
    mode: "kisi-kisi",
    name: "Okimasu Review Set",
    fileName: "jft_okimasu_review.json",
    description: "Kisi-kisi review questions for quick drills."
  }
];

export function getQuizFilesByMode(mode: QuizMode) {
  return quizFiles.filter((file) => file.mode === mode);
}
