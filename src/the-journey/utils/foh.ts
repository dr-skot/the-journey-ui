import moment, { Moment } from 'moment';

export interface DoorPolicy { open: number, close: number };
export type Punctuality = 'early' | 'on time' | 'late' | 'too late'

export type Time = Date | Moment

const DEFAULT_DOOR_POLICY = { open: 30, close: 10 }

export const diff = (curtain: Time, arrival: Time) =>
  moment.duration(moment(curtain).diff(moment(arrival))).as('minutes');

export const punctuality = (curtain: Time, time: Time, doorPolicy: DoorPolicy = DEFAULT_DOOR_POLICY) => {
  const minutes = diff(curtain, time);
  return minutes > doorPolicy.open ? 'early'
    : minutes < -doorPolicy.close ? 'too late'
    : minutes < 0 ? 'late' : 'on time';
}

export const formatTime = (time: Time) => ({
  day: moment(time).format('dddd, MMMM D'),
  time: moment(time).format('h:mma'),
});

// this isn't meant to be cryptography, it just encodes a to-the-minute timestamp
// in a 6-letter string, not easily guessable, for use as a url parameter

const BASE_TIME = new Date('2020').getTime();
const CLIP_SECONDS = 10000;

const base26ToLetters = (base26: string) =>
  base26.replace(/\d/g, (d: string) => 'zyxwvutsrq'[parseInt(d)]);

const lettersToBase26 = (letters: string) =>
  letters.replace(/[zyxwvutsrq]/g,
    (ltr: string) => 'zyxwvutsrq'.indexOf(ltr).toString());

const timeToNumber = (time: Date) =>
  Math.floor((time.getTime() - BASE_TIME) / CLIP_SECONDS);

const numberToTime = (n: number) =>
  new Date(n * CLIP_SECONDS + BASE_TIME);

const shiftByOne = (s: string) => `${s.slice(-1)}${s.slice(0, -1)}`;
const unshiftByOne = (s: string) => `${s.slice(1)}${s[0]}`;

export const timeToCode = (time: Date) =>
  shiftByOne(base26ToLetters(timeToNumber(time).toString(26)));

export const codeToTime = (code: string) =>
  numberToTime(parseInt(lettersToBase26(unshiftByOne(code)), 26));

