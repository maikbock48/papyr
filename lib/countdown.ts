// Get the next upload window start time (20:00)
export function getNextUploadWindow(): Date {
  const now = new Date();
  const hour = now.getHours();

  // Create target date for 20:00 today
  const target = new Date();
  target.setHours(20, 0, 0, 0);

  // If we're past 20:00 or before 2:00 (inside the window),
  // the next window is tomorrow at 20:00
  if (hour >= 20 || hour < 2) {
    target.setDate(target.getDate() + 1);
  }
  // If we're between 2:00 and 20:00, the window is today at 20:00

  return target;
}

// Calculate time remaining until next upload window
export function getTimeUntilNextWindow(): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const target = getNextUploadWindow();
  const diff = target.getTime() - now.getTime();

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds
  };
}

// Format countdown for display
export function formatCountdown(hours: number, minutes: number, seconds: number): string {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  return `${h}:${m}:${s}`;
}
