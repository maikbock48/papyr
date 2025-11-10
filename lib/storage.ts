export interface Commitment {
  id: string;
  date: string;
  imageData: string;
  goals: string;
  isDeveloping: boolean;
  timestamp: number;
  signatureInitials: string | null;
  completed: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  count: 0 | 1 | 2 | 3;
  morning: string; // HH:MM format
  afternoon: string; // HH:MM format
  evening: string; // HH:MM format
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
  jokers: number;
  lastShownPopupDay: number | null;
  totalCommitments: number;
  notificationSettings: NotificationSettings;
}

const STORAGE_KEY = 'papyr_state';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  count: 0,
  morning: '08:00',
  afternoon: '14:00',
  evening: '20:00',
};

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
      jokers: 0,
      lastShownPopupDay: null,
      totalCommitments: 0,
      notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
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
      jokers: 0,
      lastShownPopupDay: null,
      totalCommitments: 0,
      notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
    };
  }

  const parsed = JSON.parse(stored);
  // Ensure new fields exist for backwards compatibility
  return {
    ...parsed,
    userName: parsed.userName || '',
    tenYearVision: parsed.tenYearVision || null,
    hasCompletedSevenDayReflection: parsed.hasCompletedSevenDayReflection || false,
    jokers: parsed.jokers || 0,
    lastShownPopupDay: parsed.lastShownPopupDay || null,
    totalCommitments: parsed.totalCommitments || parsed.commitments?.length || 0,
    notificationSettings: parsed.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS,
    commitments: parsed.commitments?.map((c: any) => ({
      ...c,
      completed: c.completed ?? false,
    })) || [],
  };
};

export const saveAppState = (state: AppState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

export const addCommitment = (imageData: string, goals: string, signWithInitials: boolean = false) => {
  const state = getAppState();
  const today = new Date().toISOString().split('T')[0];

  // Calculate streak with Joker system
  let newStreak = state.currentStreak;
  let jokersUsed = 0;

  if (state.lastCommitmentDate) {
    const lastDate = new Date(state.lastCommitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - continue streak
      newStreak += 1;
    } else if (diffDays === 2 && state.jokers > 0) {
      // Missed exactly 1 day - use Joker automatically
      jokersUsed = 1;
      newStreak += 1; // Continue streak
    } else if (diffDays > 1) {
      // Missed more than 1 day or no Joker available - reset streak
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // Award Joker every 7 days of streak
  let newJokers = state.jokers - jokersUsed;
  if (newStreak > 0 && newStreak % 7 === 0) {
    newJokers += 1;
  }

  // Extract initials from userName
  const initials = signWithInitials && state.userName
    ? state.userName
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .join('')
    : null;

  const newCommitment: Commitment = {
    id: Date.now().toString(),
    date: today,
    imageData,
    goals,
    isDeveloping: true,
    timestamp: Date.now(),
    signatureInitials: initials,
    completed: false,
  };

  state.commitments.unshift(newCommitment);
  state.currentStreak = newStreak;
  state.jokers = newJokers;
  state.lastCommitmentDate = today;
  state.totalCommitments += 1;

  saveAppState(state);
  return { commitment: newCommitment, jokersUsed };
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
  // TESTING MODE: Always return true to allow uploads anytime
  return true;

  // PRODUCTION CODE (commented out):
  // const now = new Date();
  // const hour = now.getHours();
  // // 20:00 (8 PM) to 02:00 (2 AM) - Die Stunde des Wolfs
  // return hour >= 20 || hour < 2;
};

export const canCommitToday = (): boolean => {
  // TESTING MODE: Always return true to allow multiple uploads per day
  return true;

  // PRODUCTION CODE (commented out):
  // const state = getAppState();
  // const today = new Date().toISOString().split('T')[0];
  // return state.lastCommitmentDate !== today;
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

export const deleteCommitment = (id: string) => {
  const state = getAppState();
  state.commitments = state.commitments.filter(c => c.id !== id);
  saveAppState(state);
};

export const markCommitmentCompleted = (id: string) => {
  const state = getAppState();
  const commitment = state.commitments.find(c => c.id === id);
  if (commitment) {
    commitment.completed = true;
    saveAppState(state);
  }
};
