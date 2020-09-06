import {
  Track, TrackPublication, VideoTrackPublication, AudioTrackPublication, DataTrackPublication,
  NetworkQualityLevel, NetworkQualityStats, Participant,
} from 'twilio-video';
import { arrayFixedLength } from '../../utils/functional';

const identities = ['Swedish Chef', 'Fozzie', 'Miss Piggy', 'Gonzo', 'Doctor Teeth', 'Floyd', 'Kermit', 'Animal',
  'Walter', 'Janice', 'Pepé', 'Rowlf', 'Bunsen & Beaker', 'Scooter', 'Joe from Legal', 'Turquoise', 'Bird',
  'B & E', 'sick in bed', 'Cookie', 'The Count', 'Grover', '???', 'Lin', 'anonymous', 'O Trafficker',
  'Caroling Chickens', 'Meryl Sheep', 'Yoda', 'Darth'];

const twoDigit = (n: number) => `${n < 10 ? '0' : ''}${n}`;

export class Muppet implements Participant {
  constructor(index: number) {
    this.sid = `muppet-${twoDigit(index + 1)}`;
    this.identity = identities[index % 30];
    this.tracks = new Map();
    this.audioTracks = new Map();
    this.dataTracks = new Map();
    this.videoTracks = new Map();
    this.networkQualityLevel = null;
    this.networkQualityStats = null;
    this.state = 'connected';
  }

  audioTracks: Map<Track.SID, AudioTrackPublication>;
  dataTracks: Map<Track.SID, DataTrackPublication>;
  identity: Participant.Identity;
  networkQualityLevel: NetworkQualityLevel | null;
  networkQualityStats: NetworkQualityStats | null;
  sid: Participant.SID;
  state: string;
  tracks: Map<Track.SID, TrackPublication>;
  videoTracks: Map<Track.SID, VideoTrackPublication>;

  addListener = (event: string | symbol, listener: (...args: any[]) => void) => this;
  emit = (event: string | symbol, ...args: any[]) => false;
  eventNames = () => [];
  getMaxListeners = () => 0;
  listenerCount = (type: string | symbol) => 0;
  listeners = (event: string | symbol) => [];
  off = (event: string | symbol, listener: (...args: any[]) => void) => this;
  on = (event: string | symbol, listener: (...args: any[]) => void) => this;
  once = (event: string | symbol, listener: (...args: any[]) => void) => this;
  prependListener = (event: string | symbol, listener: (...args: any[]) => void) => this;
  prependOnceListener = (event: string | symbol, listener: (...args: any[]) => void) => this;
  rawListeners = (event: string | symbol) => [];
  removeAllListeners = (event: string | symbol) => this;
  removeListener = (event: string | symbol, listener: (...args: any[]) => void) => this;
  setMaxListeners = (n: number) => this;
}

export const padWithMuppets = (length: number) => (list: Participant[]) => (
  arrayFixedLength(length)(list).map((participant, i) => participant || new Muppet(i))
);

export const muppetImage = (possibleMuppet: Participant) => {
  //if (!(possibleMuppet instanceof Muppet)) return '';
  const number = possibleMuppet.sid.split('-')[1];
  return `${process.env.PUBLIC_URL}/mock-participants/${number}.png`;
}
export const muppetImageForIdx = (idx: number) => {
  return `${process.env.PUBLIC_URL}/mock-participants/${twoDigit(idx)}.png`;
}
