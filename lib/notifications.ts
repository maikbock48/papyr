import { getAppState, saveAppState } from './storage';

const NOTIFICATION_MESSAGES = [
  'Zeit für dein Bekenntnis! 📝',
  'Dein PAPYR wartet auf dich. ✨',
  'Was wird heute dein Ziel sein? 🎯',
  'Schreib deinen Zettel und siegle ihn. 🔥',
  'Die Stunde des Wolfs naht. Bist du bereit? 🌙',
  'Dein Erfolg beginnt mit einem Zettel. 💪',
];

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleNotifications() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const state = getAppState();
  const settings = state.notificationSettings;

  // Clear any existing scheduled notifications
  clearScheduledNotifications();

  if (!settings.enabled) {
    return;
  }

  // Schedule notifications at fixed times if enabled
  if (settings.morning) scheduleNotificationForTime('09:30');
  if (settings.afternoon) scheduleNotificationForTime('15:00');
  if (settings.evening) scheduleNotificationForTime('19:00');
}

function scheduleNotificationForTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  const timeoutId = setTimeout(() => {
    showNotification();
    // Reschedule for the next day
    scheduleNotificationForTime(time);
  }, timeUntilNotification);

  // Store timeout ID for clearing later
  const key = `notification_timeout_${time}`;
  if (typeof window !== 'undefined') {
    (window as any)[key] = timeoutId;
  }
}

function clearScheduledNotifications() {
  if (typeof window === 'undefined') return;

  // Clear all fixed-time notifications
  ['09:30', '15:00', '19:00'].forEach((time) => {
    const key = `notification_timeout_${time}`;
    const timeoutId = (window as any)[key];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete (window as any)[key];
    }
  });
}

function showNotification() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    const message = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
    const notification = new Notification('PAPYR', {
      body: message,
      icon: '/assets/PAPYR.png',
      badge: '/assets/PAPYR.png',
      tag: 'papyr-reminder',
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export function updateNotificationSettings(
  enabled: boolean,
  morning: boolean,
  afternoon: boolean,
  evening: boolean
) {
  const state = getAppState();
  state.notificationSettings = {
    enabled,
    morning,
    afternoon,
    evening,
  };
  saveAppState(state);

  // Reschedule notifications
  scheduleNotifications();
}
