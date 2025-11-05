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
  commitments: Commitment[];
  currentStreak: number;
  lastCommitmentDate: string | null;
}

const STORAGE_KEY = 'papyr_state';

export const getAppState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      hasCompletedOnboarding: false,
      hasPaid: false,
      commitments: [],
      currentStreak: 0,
      lastCommitmentDate: null,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      hasCompletedOnboarding: false,
      hasPaid: false,
      commitments: [],
      currentStreak: 0,
      lastCommitmentDate: null,
    };
  }

  return JSON.parse(stored);
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

export const completeOnboarding = (hasPaid: boolean) => {
  const state = getAppState();
  state.hasCompletedOnboarding = true;
  state.hasPaid = hasPaid;
  saveAppState(state);
};

export const isWithinWolfHour = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  // 21:00 (9 PM) to 03:00 (3 AM)
  return hour >= 21 || hour < 3;
};

export const canCommitToday = (): boolean => {
  const state = getAppState();
  const today = new Date().toISOString().split('T')[0];
  return state.lastCommitmentDate !== today;
};

export const needsPaywall = (): boolean => {
  const state = getAppState();
  return state.commitments.length >= 7 && !state.hasPaid;
};
