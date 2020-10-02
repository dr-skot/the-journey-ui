import { codeToTimeWithTZ, DEFAULT_DOOR_POLICY, DoorPolicy, punctuality, Punctuality, timezones } from '../utils/foh';
import { useSharedRoomState } from '../contexts/AppStateContext';
import { DateTime } from 'luxon';
import { cached } from '../utils/react-help';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';
import { serverNow } from '../utils/ServerDate';

// TODO use server time instead of trusting client's clock

const DAY_FORMAT = 'EEEE, MMMM d';
const TIME_FORMAT = 'h:mma';

const LONGER_THAN_SHOW = 120;

function invalidTimezone(tzIndex: number) {
  return tzIndex < 0
}
function invalidCurtainTime(curtain: DateTime) {
  const now = serverNow();
  return curtain < now.minus({ years: 1 })
    || curtain > now.plus({ years: 1 });
}

export interface ShowtimeData {
  code: string,
  canEnter: boolean,
  punct: Punctuality,
  doorPolicy: DoorPolicy,
  local: { day: string, time: string },
  venue: { day: string, time: string, timezone: string, doorsClose: string },
}

export default function useShowtime() {
  const [{ doorsClosed }] = useSharedRoomState();
  const match = useRouteMatch() as match<{ code?: string }>;
  const code = match.params.code;
  const doorPolicy = DEFAULT_DOOR_POLICY;
  const now = serverNow();

  if (!code) return undefined;

  console.log('useShowtime knows ServerDate is', now);

  // decode code to get curtain time
  const [time, tzIndex] = codeToTimeWithTZ(code);
  const curtain = DateTime.fromJSDate(time);

  if (invalidTimezone(tzIndex) || invalidCurtainTime(curtain)) return undefined;

  const doorsClose = doorsClosed === 'undefined'
    ? curtain.plus({ minutes: doorPolicy.close })
    : DateTime.fromISO(doorsClosed);

  // check for previously-saved entry, or use now
  // TODO expire these codes from local storage
  const localStorageKey = `entered-${code}`;
  const alreadySaved = localStorage.getItem(localStorageKey);
  const entryTime = alreadySaved ? DateTime.fromISO(alreadySaved) : now;

  // is entry time good?
  const wayTooLate = curtain.plus({ minutes: LONGER_THAN_SHOW }) < now;
  const punct = doorsClose < entryTime || wayTooLate
    ? 'too late'
    : punctuality(curtain, entryTime, doorPolicy);
  const canEnter = punct === 'on time' || punct === 'late';

  // save successful entry time if we haven't saved one yet
  if (canEnter && !alreadySaved) {
    localStorage.setItem(localStorageKey, entryTime.toJSON());
  }

  // format info for display
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = timezones[tzIndex] || localTz;

  const local = {
    day: curtain.toFormat(DAY_FORMAT),
    time: curtain.toFormat(TIME_FORMAT),
  };

  const friendlyTimezone = (timezone: string) => (
    timezone.replace(/^.*\//, '').replace('_', ' ')
  )

  const venue = {
    day: curtain.setZone(timezone).toFormat(DAY_FORMAT),
    time: curtain.setZone(timezone).toFormat(TIME_FORMAT),
    timezone: friendlyTimezone(timezone),
    // if curtain was more than an hour ago, door close time is not worth mentioning
    doorsClose: now < curtain.plus({ hours: 1 })
      ? doorsClose.setZone(timezone).toFormat(TIME_FORMAT)
      : undefined,
  }

  console.log('useShowtime', { code, punct, canEnter, local, venue, doorPolicy, doorsClosed });

  return cached('useShowtime').ifEqual(
    { punct, canEnter, local, venue, doorPolicy, code }
  ) as ShowtimeData;

}
