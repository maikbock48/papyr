export interface DailyQuestion {
  day: number;
  question: string;
  subtitle: string;
}

export const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    day: 1,
    question: "Was wäre anders, wenn du heute dein Leben ernst nehmen würdest?",
    subtitle: "Tag 1 – Der Anfang"
  },
  {
    day: 2,
    question: "Wer bist du, wenn niemand zuschaut?",
    subtitle: "Tag 2 – Die Wahrheit"
  },
  {
    day: 3,
    question: "Was würdest du tun, wenn Scheitern unmöglich wäre?",
    subtitle: "Tag 3 – Die Angst"
  },
  {
    day: 4,
    question: "Welche Ausrede hält dich am stärksten zurück?",
    subtitle: "Tag 4 – Die Ehrlichkeit"
  },
  {
    day: 5,
    question: "Wofür würde dein zukünftiges Ich dir heute danken?",
    subtitle: "Tag 5 – Die Vision"
  },
  {
    day: 6,
    question: "Was ist wichtiger: Komfort heute oder Stolz morgen?",
    subtitle: "Tag 6 – Die Entscheidung"
  },
  {
    day: 7,
    question: "Bist du bereit, dich selbst nicht mehr zu enttäuschen?",
    subtitle: "Tag 7 – Das Versprechen"
  }
];

export interface QuestionAnswer {
  day: number;
  question: string;
  answer: string;
  timestamp: number;
}

export const getDailyQuestion = (day: number): DailyQuestion | null => {
  if (day < 1 || day > 7) return null;
  return DAILY_QUESTIONS[day - 1];
};

export const hasAnsweredQuestion = (day: number): boolean => {
  if (typeof window === 'undefined') return false;
  const answers = getAnswers();
  return answers.some(a => a.day === day);
};

export const saveAnswer = (day: number, question: string, answer: string) => {
  if (typeof window === 'undefined') return;

  const answers = getAnswers();
  answers.push({
    day,
    question,
    answer,
    timestamp: Date.now()
  });

  localStorage.setItem('papyr_question_answers', JSON.stringify(answers));
};

export const getAnswers = (): QuestionAnswer[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('papyr_question_answers');
  if (!stored) return [];

  return JSON.parse(stored);
};

export const shouldShowDailyQuestion = (currentStreak: number): boolean => {
  // Show question only for days 1-7
  if (currentStreak < 1 || currentStreak > 7) return false;

  // Check if already answered today's question
  return !hasAnsweredQuestion(currentStreak);
};
