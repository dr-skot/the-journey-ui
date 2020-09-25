import { codeToTimeWithTZ, DEFAULT_DOOR_POLICY, DoorPolicy, punctuality, Punctuality, timezones } from '../utils/foh';
import { useSharedRoomState } from '../contexts/AppStateContext';
import { DateTime } from 'luxon';
import { cached } from '../utils/react-help';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

const DAY_FORMAT = 'EEEE, MMMM d';
const TIME_FORMAT = 'h:mma';

const dateTimeOrNow = (iso: string | null) =>
  iso ? DateTime.fromISO(iso) : DateTime.local();

interface UseShowtimeResult {
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

  // decode code to get curtain time
  const [time, tzIndex] = code ? codeToTimeWithTZ(code) : [undefined, -1];
  const curtain = time
    ? DateTime.fromJSDate(time)
    : DateTime.local().plus({ minutes: 15 });

  const doorsClose = doorsClosed === 'undefined'
    ? curtain.plus({ minutes: doorPolicy.close })
    : DateTime.fromISO(doorsClosed);

  // check for previously-saved entry, or use now
  const localStorageKey = `entered-${code}`;
  const alreadySaved = localStorage.getItem(localStorageKey);
  const entryTime = dateTimeOrNow(alreadySaved);

  // is entry time good?
  const punct = doorsClose < entryTime
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
    doorsClose: doorsClose.setZone(timezone).toFormat(TIME_FORMAT),
  }

  console.log('useShowtime', { punct, canEnter, local, venue, doorPolicy, doorsClosed });

  return cached('useShowtime').ifEqual(
    { punct, canEnter, local, venue, doorPolicy }
  ) as UseShowtimeResult;

}
