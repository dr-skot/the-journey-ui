import Video, {
  Room,
  Participant,
  RemoteAudioTrackPublication,
  RemoteTrackPublication,
  LocalTrackPublication,
  LocalTrack,
  LocalVideoTrack, LocalAudioTrack, Track, LocalDataTrack,
} from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import { Sid } from 'twilio/lib/interfaces';
import { element, unixTime } from './functional';
import { isDev } from './react-help';
import { sortBy, isEqual } from 'lodash';

const DEFAULT_OPTIONS = {
  tracks: [],
  // automaticSubscription: false,
}

export function getToken(roomName: string, identity: string) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ identity, roomName });
  return fetch(`${endpoint}?${params}`, { headers }).then(res => res.text());
}

export function connect(token: string, roomName: string, options: Video.ConnectOptions = {}, tracks: LocalTrack[]) {
  return Video.connect(token, {
    ...DEFAULT_OPTIONS,
    // ...options,
    name: roomName
  }).then(room => {
    publishTracks(room, tracks);
    return room
  });
}

type Priorities = Record<Track.Kind, Track.Priority>;


function publishTracks(room: Room, tracks: LocalTrack[]) {
  const videoTrack = tracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const audioTrack = tracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  const me = room.localParticipant;
  const priorities: Priorities = isRole('star')(me)
    ? { video: 'high', audio: 'high', data: 'standard' }
    : { video: 'low', audio: 'standard', data: 'standard' };

  console.log('publishing tracks with priorities', priorities);

  [videoTrack, audioTrack].forEach(track => {
    // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
    // However, tracks must be published manually in order to set the priority on them.
    // All video tracks are published with 'low' priority. This works because the video
    // track that is displayed in the 'MainParticipant' component will have it's priority
    // set to 'high' via track.setPriority()
    if (track) {
      room.localParticipant.publishTrack(track, { priority: priorities[track.kind] })
    }
  });
}

export function joinRoom(roomName: string, identity: string, options:  Video.ConnectOptions = {}, tracks: LocalTrack[] = []) {
  return getToken(roomName, identity).then(token => connect(token, roomName, options, tracks));
}


export type TrackFilter = 'audio' | 'video' | 'data' | undefined

export function getTracks(room: Room, kind: TrackFilter = undefined) {
  const tracks = new Map();
  room.participants.forEach((p) => {
    tracks.set(p.identity,
      kind === 'audio' ? p.audioTracks
    : kind === 'video' ? p.videoTracks
    : kind === 'data' ? p.dataTracks
    : p.tracks);
  });
  return tracks;
}

export function getLocalTracks() {
  return Video.createLocalTracks({
    video: {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
    },
    audio: true,
  })
}

export function getLocalDataTrack(room: Room): Promise<LocalDataTrack> {
  const me = room.localParticipant;
  const existingTrack = Array.from(me.dataTracks.values())
    .map((pub) => pub.track)
    .find((track) => !!track.send);
  if (existingTrack) return Promise.resolve(existingTrack);
  const promise = new Promise<LocalDataTrack>((resolve, reject) => {
    function handlePublished(pub: LocalTrackPublication) {
      if (pub.kind === 'data') {
        me.off('trackPublished', handlePublished);
        resolve(pub.track as LocalDataTrack);
      }
    }
    me.on('trackPublished', handlePublished);
  });
  me.publishTrack(new LocalDataTrack());
  return promise;
}

export function getPublications(participant: Participant) {
  return Array.from(participant.tracks.values()) as (LocalTrackPublication | RemoteTrackPublication)[];
}


//
// SUBSCRIBING
//

export type SubscribeProfile = 'audio' | 'data-only' | 'focus' | 'gallery' | 'listen' | 'none'
const TIMEOUT_DELAY = 5000;

export function subscribe(room: string, participantId: string, policy: string = 'data_only', focus: string[] = []) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_SUBSCRIBE_ENDPOINT || '/subscribe';

  const esc = encodeURIComponent;

  const params = `${esc(room)}/${esc(participantId)}/${esc(policy)}?focus=${focus.map(esc).join(',')}`;
  const url = `${endpoint}/${params}`

  console.log(`fetching ${url}`);

  const timeoutId = setTimeout(
    () => console.log(`fetch ${url} no answer after ${TIMEOUT_DELAY}ms`)
    , TIMEOUT_DELAY
  );

  return fetch(url, { headers })
    .then(res => console.log(`${policy} subscribe successful, result`, res))
    .catch(error => console.log(`error subscribing to ${policy}:`, error))
    .finally(() => clearTimeout(timeoutId));
}

export const extractTracks = (publishers: Map<Sid, Map<Sid, RemoteAudioTrackPublication>>) => (
  Array.from(publishers.values())
    .flatMap((publications) => Array.from(publications.values()))
    .map(publication => publication.track)
)


export type UserRole = 'audience' | 'operator' | 'gallery' | 'foh' | 'lurker' | 'signer' | 'star'

export const getIdentity = (type: UserRole = 'lurker', username?: String) =>
  `${username || type}|${type}|${unixTime()}`;

export const getUsername = (identity: string) =>
  identity.split('|').slice(0, -2).join('|') || identity;

export const getParticipants = (room?: Room) => room ?
  [room.localParticipant, ...Array.from(room.participants.values())] : [];

export const getRole = (p?: Participant) => p ? element(-2)(p.identity.split('|')) : undefined;

export const isRole = (type: UserRole) => (p?: Participant) => getRole(p) === type;

export const defaultRoom = () => isDev() ? 'room' : 'room';

export const getSigner = (room?: Room) =>
  Array.from(room?.participants.values() || [])
    .find(isRole('signer'));


interface PrioritySettings {
  video: Track.Priority,
  audio: Track.Priority,
}
export const setTrackPriorities = (room: Room, settings: PrioritySettings) => {
  const participant = room.localParticipant
  console.log('setting priorities...');
  participant.videoTracks.forEach(pub => {
    console.log('setting video priority', settings.video, 'for', participant.identity);
    // @ts-ignore
    pub.setPriority(settings.video);
  });
  participant.audioTracks.forEach(pub => {
    console.log('setting audio priority', settings.video, 'for', participant.identity);
      // @ts-ignore
    pub.setPriority(settings.audio);
  });
}


export const getTimestamp = (p?: Participant) => p ? element(-1)(p.identity.split('|')) : '';

export const sortedParticipants = (ps: Participant[]) => sortBy(ps, getTimestamp);
export const getIdentities = (ps: Participant[]) => ps.map((p) => p.identity);
export const sortedIdentities = (ps: Participant[]) => getIdentities(sortedParticipants(ps));

export const inGroup = (group: string[]) => (p: Participant) => group.includes(p.identity);
export const sameIdentities = (a: Participant[], b: Participant[]) =>
  isEqual(sortedIdentities(a), sortedIdentities(b));

export const getStar = (participants: Map<string, Participant>) =>
  Array.from(participants.values()).find(isRole('star'));


