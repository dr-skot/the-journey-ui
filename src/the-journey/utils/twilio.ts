import Video, {
  Room,
  Participant,
  LocalTrackPublication,
  LocalTrack,
  LocalVideoTrack,
  LocalAudioTrack,
  Track,
  LocalDataTrack,
  CreateLocalTrackOptions,
  RemoteTrack,
  VideoBandwidthProfileOptions,
} from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import { element, unixTime } from './functional';
import { isDev } from './react-help';
import { sortBy, isEqual } from 'lodash';
import { RenderDimensionValue } from '../contexts/settings/renderDimensions';

// same as settings but everything's optional
export interface SettingsAdjust {
  trackSwitchOffMode?: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode?: VideoBandwidthProfileOptions['mode'];
  maxTracks?: string;
  maxAudioBitrate?: string;
  renderDimensionLow?: RenderDimensionValue;
  renderDimensionStandard?: RenderDimensionValue;
  renderDimensionHigh?: RenderDimensionValue;
}

const DEFAULT_OPTIONS = {
  tracks: [],
  automaticSubscription: false,
}

export function getToken(roomName: string, identity: string) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ identity, roomName });
  return fetch(`${endpoint}?${params}`, { headers }).then(res => res.text());
}

export let joinOptions: Video.ConnectOptions = {};
export function connect(token: string, roomName: string, options: Video.ConnectOptions = {}, tracks: LocalTrack[]) {
  console.log('connecting with options', { ...DEFAULT_OPTIONS, ...options });
  joinOptions = { ...DEFAULT_OPTIONS, ...options };
  return Video.connect(token, {
    ...DEFAULT_OPTIONS,
    ...options,
    name: roomName
  }).then(room => {
    window.addEventListener('beforeunload', () => room?.disconnect());
    publishTracks(room, tracks);
    return room
  });
}

type Priorities = Record<Track.Kind, Track.Priority>;


function publishTracks(room: Room, tracks: LocalTrack[]) {
  console.log('publishing tracks...');
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

export function getSubscribedTracks(room: Room, kind: TrackFilter = undefined) {
  const tracks: RemoteTrack[] = [];
  room.participants.forEach(p => p.tracks.forEach(pub => {
    if (pub.track && (!kind || pub.track.kind === kind)) tracks.push(pub.track);
  }));
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
  const promise = new Promise<LocalDataTrack>((resolve) => {
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



//
// SUBSCRIBING
//
export type SubscribeProfile =
  'data-only' | 'audio' | 'focus' | 'focus-safer' | 'gallery' | 'listen' | 'watch' | 'nothing'

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



export type UserRole =
  'audience' | 'operator' | 'gallery' | 'foh' | 'lurker' | 'sign-interpreter' | 'star' | 'focus' | 'log'

export const getIdentity = (type: UserRole = 'lurker', username?: String) =>
  `${username || type}|${type}|${unixTime()}`;

export const getUsername = (identity: string) =>
  identity.split('|').slice(0, -2).join('|') || identity;

export const getParticipants = (room?: Room) => room ?
  [room.localParticipant, ...Array.from(room.participants.values())] : [];

export const getRole = (p?: Participant) => p ? element(-2)(p.identity.split('|')) : undefined;

export const isRole = (type: UserRole) => (p?: Participant) => getRole(p) === type;

export const defaultRoom = () => isDev() ? 'dev-room2' : 'room2';

export const getTimestamp = (p?: Participant) => p ? element(-1)(p.identity.split('|')) : '';

export const sortedParticipants = (ps: Participant[]) => sortBy(ps, getTimestamp);
export const getIdentities = (ps: Participant[]) => ps.map((p) => p?.identity); // TODO why are some ps null?
export const sortedIdentities = (ps: Participant[]) => getIdentities(sortedParticipants(ps));

export const inGroup = (group: string[] = []) => (p?: Participant) => !!p && group.includes(p.identity);
export const sameIdentities = (a: Participant[], b: Participant[]) =>
  isEqual(sortedIdentities(a), sortedIdentities(b));

//
// local video toggle
//`
let localVideoTrack: LocalVideoTrack | undefined;
let videoDeviceId: string | undefined;
export function toggleVideoEnabled(room: Room | undefined, localTracks: (LocalVideoTrack | LocalAudioTrack)[]) {
  const { localParticipant } = room || {};
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  if (videoTrack) {
    videoDeviceId = videoTrack.mediaStreamTrack.getSettings().deviceId;
    const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
    // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
    localParticipant?.emit('trackUnpublished', localTrackPublication);
    removeLocalVideoTrack(localTrackPublication?.track as LocalVideoTrack | undefined);
    return Promise.resolve(localTracks.filter(t => t !== localTrackPublication?.track));
  } else {
     return getLocalVideoTrack({ deviceId: { exact: videoDeviceId } })
       .then((track: LocalVideoTrack) => {
         localParticipant?.publishTrack(track, { priority: 'low' });
         return [...localTracks, track];
       })
       .catch((e: Error) => console.log('error gettingLocalVideoTrack', e));
  }
}

function getLocalVideoTrack(newOptions?: CreateLocalTrackOptions) {
  // In the DeviceSelector and FlipCameraButton components, a new video track is created,
  // then the old track is unpublished and the new track is published. Unpublishing the old
  // track and publishing the new track at the same time sometimes causes a conflict when the
  // track name is 'camera', so here we append a timestamp to the track name to avoid the
  // conflict.
  const options: CreateLocalTrackOptions = {
    ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
    name: `camera-${Date.now()}`,
    ...newOptions,
  };

  return Video.createLocalVideoTrack(options).then(newTrack => {
    localVideoTrack = newTrack;
    return newTrack;
  });
}

function removeLocalVideoTrack(track: LocalVideoTrack | undefined = localVideoTrack) {
  if (track) {
    track.stop();
    localVideoTrack = undefined;
  }
}

export function removeParticipant(participant: Participant, room?: Room) {
  if (!room) return Promise.reject('No room!');
  return fetch(`/disconnect/${room.name}/${participant.identity}`);
}
