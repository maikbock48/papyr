// Calendar integration utilities

/**
 * Generates an .ics file for adding daily PAPYR reminder to calendar
 * Creates a recurring daily event from 20:00 to 02:00
 */
export function generatePapyrCalendarEvent(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Start time: Today at 20:00
  const startDate = `${year}${month}${day}T200000`;

  // End time: Next day at 02:00 (6 hours later)
  const endDateTime = new Date(now);
  endDateTime.setHours(20, 0, 0, 0);
  endDateTime.setHours(endDateTime.getHours() + 6); // 20:00 + 6h = 02:00
  const endYear = endDateTime.getFullYear();
  const endMonth = String(endDateTime.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDateTime.getDate()).padStart(2, '0');
  const endDate = `${endYear}${endMonth}${endDay}T020000`;

  // Generate unique UID
  const uid = `papyr-daily-reminder-${Date.now()}@papyr.app`;

  // Current timestamp for DTSTAMP
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PAPYR//Daily Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:PAPYR Erinnerungen',
    'X-WR-TIMEZONE:Europe/Berlin',
    'X-WR-CALDESC:Tägliche Erinnerung für dein PAPYR Ritual',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:PAPYR - Schreibe deinen Zettel ✍️',
    'DESCRIPTION:Zeit für dein tägliches Ritual! Schreibe 1-2 Ziele auf deinen Zettel und lade ihn in PAPYR hoch.\\n\\nUpload-Fenster: 20:00 - 02:00 Uhr\\n\\nDisziplin ist die Brücke zwischen Zielen und Erfolg.',
    'LOCATION:Dein Zuhause',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:PAPYR Erinnerung in 15 Minuten',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Downloads the .ics file for the user
 */
export function downloadCalendarEvent() {
  const icsContent = generatePapyrCalendarEvent();
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'PAPYR-Taegliche-Erinnerung.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Creates a data URL for mobile calendar apps
 * This allows direct opening in calendar apps on mobile
 */
export function openInCalendarApp() {
  const icsContent = generatePapyrCalendarEvent();
  const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  window.open(dataUrl);
}

/**
 * Detects if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Creates a one-time calendar event for a specific commitment
 */
export function generateCommitmentCalendarEvent(
  date: Date,
  goals: string
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Event is all-day
  const dateStr = `${year}${month}${day}`;

  const uid = `papyr-commitment-${date.getTime()}@papyr.app`;
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PAPYR//Commitment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    'SUMMARY:PAPYR Bekenntnis 📝',
    `DESCRIPTION:Deine Ziele für heute:\\n\\n${goals.replace(/\n/g, '\\n')}\\n\\nDisziplin ist die Brücke zwischen Zielen und Erfolg.`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Downloads a specific commitment as calendar event
 */
export function downloadCommitmentEvent(date: Date, goals: string) {
  const icsContent = generateCommitmentCalendarEvent(date, goals);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = date.toISOString().split('T')[0];
  link.download = `PAPYR-Bekenntnis-${dateStr}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
