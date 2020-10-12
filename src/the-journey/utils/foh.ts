import { DateTime } from 'luxon';
import { serverNow } from './ServerDate';
import { codeToTimeWithTZ, timezones } from './codes';

export const DEFAULT_DOOR_POLICY = { open: 30, close: 90 }
export const DAY_FORMAT = 'EEEE, MMMM d';
export const TIME_FORMAT = 'h:mm a';

export function invalidTimezone(tzIndex: number) {
  return tzIndex < 0
}
export function invalidCurtainTime(curtain: DateTime) {
  const now = serverNow();
  return !curtain
    || curtain < now.minus({ years: 1 })
    || curtain > now.plus({ years: 1 });
}

const isValidDate = (time?: Date) => time && !isNaN(time.getTime());

export function validateCode(code?: string) {
  if (!code) return undefined;
  const [time, tzIndex] = codeToTimeWithTZ(code);
  if (!isValidDate(time)) return undefined;
  const curtain = DateTime.fromJSDate(time);
  if (invalidCurtainTime(curtain) || invalidTimezone(tzIndex)) return undefined;
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = (tzIndex ? timezones[tzIndex] : '') || localTz;
  return { curtain, timezone };
}

// given doorsOpen in minutes before curtain, and doorsClosed as ISO date string or 'undefined',
//    and a curtain time, return the open and close times for this show
export function getEntryWindow(curtain: DateTime, doorsOpen: number = DEFAULT_DOOR_POLICY.open, doorsClosed: string) {
  return {
    // TODO this is legacy defensiveness; doorsOpen should never be undefined
    open: curtain.minus({ minutes: doorsOpen }),
    close: doorsClosed === 'undefined'
      ? curtain.plus({ minutes: DEFAULT_DOOR_POLICY.close })
      : DateTime.fromISO(doorsClosed),
  };
}

// entry time storage (so bumped-out users can re-enter after doors close)
// TODO expire these entry times from local storage
const localStorageKey = (code: string) => `entered-${code}`;
function getSavedEntryTime(code: string) {
  const isoString = localStorage.getItem(localStorageKey(code));
  return isoString ? DateTime.fromISO(isoString) : undefined;
}
function saveEntryTime(code:string, entryTime: DateTime) {
  localStorage.setItem(localStorageKey(code), entryTime.toJSON());
}

export function canEnter(showtime: { code: string, curtain: DateTime, open: DateTime, close: DateTime }) {
  const { code, open, close } = showtime;
  const now = serverNow();
  const fallsInWindow = (date: DateTime) => date > open && date < close;
  const savedEntryTime = getSavedEntryTime(code);
  const canEnter = fallsInWindow(now) || (savedEntryTime && fallsInWindow(savedEntryTime));
  if (canEnter && !savedEntryTime) saveEntryTime(code, now);
  return canEnter;
}

export function formatTime(time: DateTime, tzIndex?: number) {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = (tzIndex ? timezones[tzIndex] : '') || localTz;
  const timeInZone = time.setZone(timezone);
  const friendlyTimezone = (timezone: string) => (
    timezone.replace(/^.*\//, '').replace('_', ' ')
  )

  return {
    day: timeInZone.toFormat(DAY_FORMAT),
    time: timeInZone.toFormat(TIME_FORMAT),
    timezone: friendlyTimezone(timezone),
  }
}
