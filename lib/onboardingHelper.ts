import { getAppState, saveAppState } from './storage';
import onboardingData from './onboardingData.json';

export interface PopupData {
  title: string;
  text: string;
  buttons: Array<{ text: string; action: string }>;
}

const MILESTONE_DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 14, 30, 50, 100, 180, 365];

export function shouldShowPopup(): boolean {
  const state = getAppState();
  const totalDays = state.totalCommitments;

  // Check if we should show a popup for this milestone
  if (MILESTONE_DAYS.includes(totalDays)) {
    // Check if we already showed this popup
    if (state.lastShownPopupDay !== totalDays) {
      return true;
    }
  }

  return false;
}

export function getPopupForDay(): PopupData | null {
  const state = getAppState();
  const totalDays = state.totalCommitments;
  const hasPaid = state.hasPaid;

  // Map day numbers to popup keys
  const popupKey = (() => {
    switch (totalDays) {
      case 1: return 'day1';
      case 2: return 'day2';
      case 3: return 'day3';
      case 4: return 'day4';
      case 5: return 'day5';
      case 6: return 'day6';
      case 7: return 'day7';
      case 8: return 'day8';
      case 10: return 'day10';
      case 14: return hasPaid ? 'day14_member' : 'day14';
      case 30: return 'day30';
      case 50: return 'day50';
      case 100: return hasPaid ? 'day100_pro' : 'day100';
      case 180: return 'day180';
      case 365: return 'day365';
      default: return null;
    }
  })();

  if (!popupKey) return null;

  const popup = onboardingData.dailyPopups[popupKey as keyof typeof onboardingData.dailyPopups];
  return popup as PopupData;
}

export function markPopupAsShown(): void {
  const state = getAppState();
  state.lastShownPopupDay = state.totalCommitments;
  saveAppState(state);
}
