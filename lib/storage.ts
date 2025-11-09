export interface Commitment {
  id: string;
  date: string;
  imageData: string;
  goals: string;
  isDeveloping: boolean;
  timestamp: number;
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  hasPaid: boolean;
  userName: string;
  commitments: Commitment[];
  currentStreak: number;
  lastCommitmentDate: string | null;
  tenYearVision: string | null;
  hasCompletedSevenDayReflection: boolean;
}

const STORAGE_KEY = 'papyr_state';

export const getAppState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      hasCompletedOnboarding: false,
      hasPaid: false,
      userName: '',
      commitments: [],
      currentStreak: 0,
      lastCommitmentDate: null,
      tenYearVision: null,
      hasCompletedSevenDayReflection: false,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      hasCompletedOnboarding: false,
      hasPaid: false,
      userName: '',
      commitments: [],
      currentStreak: 0,
      lastCommitmentDate: null,
      tenYearVision: null,
      hasCompletedSevenDayReflection: false,
    };
  }

  const parsed = JSON.parse(stored);
  // Ensure new fields exist for backwards compatibility
  return {
    ...parsed,
    userName: parsed.userName || '',
    tenYearVision: parsed.tenYearVision || null,
    hasCompletedSevenDayReflection: parsed.hasCompletedSevenDayReflection || false,
  };
};

export const saveAppState = (state: AppState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

export const addCommitment = (imageData: string, goals: string) => {
  const state = getAppState();
  const today = new Date().toISOString().split('T')[0];

  // Calculate streak
  let newStreak = state.currentStreak;
  if (state.lastCommitmentDate) {
    const lastDate = new Date(state.lastCommitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const newCommitment: Commitment = {
    id: Date.now().toString(),
    date: today,
    imageData,
    goals,
    isDeveloping: true,
    timestamp: Date.now(),
  };

  state.commitments.unshift(newCommitment);
  state.currentStreak = newStreak;
  state.lastCommitmentDate = today;

  saveAppState(state);
  return newCommitment;
};

export const markCommitmentDeveloped = (id: string) => {
  const state = getAppState();
  const commitment = state.commitments.find(c => c.id === id);
  if (commitment) {
    commitment.isDeveloping = false;
    saveAppState(state);
  }
};

export const completeOnboarding = (hasPaid: boolean, userName: string) => {
  const state = getAppState();
  state.hasCompletedOnboarding = true;
  state.hasPaid = hasPaid;
  state.userName = userName;
  saveAppState(state);
};

export const isWithinWolfHour = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  // 20:00 (8 PM) to 02:00 (2 AM) - Die Stunde des Wolfs
  return hour >= 20 || hour < 2;
};

export const canCommitToday = (): boolean => {
  const state = getAppState();
  const today = new Date().toISOString().split('T')[0];
  return state.lastCommitmentDate !== today;
};

export const needsPaywall = (): boolean => {
  const state = getAppState();
  // 14 Tage Free Trial (nicht 7!)
  return state.commitments.length >= 14 && !state.hasPaid;
};

export const needsSevenDayReflection = (): boolean => {
  const state = getAppState();
  return state.currentStreak === 7 && !state.hasCompletedSevenDayReflection;
};

export const completeSevenDayReflection = (vision: string, hasPaid: boolean) => {
  const state = getAppState();
  state.tenYearVision = vision;
  state.hasCompletedSevenDayReflection = true;
  state.hasPaid = hasPaid;
  saveAppState(state);
};
