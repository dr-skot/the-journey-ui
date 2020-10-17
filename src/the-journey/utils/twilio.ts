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
  VideoBandwidthProfileOptions, LocalParticipant, LogLevel,
} from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import { element, unixTime } from './functional';
import { isDev } from './react-help';
import { sortBy, isEqual } from 'lodash';
import { RenderDimensionValue } from '../contexts/settings/renderDimensions';
import { fetchWithDelayReport } from './fetch';

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
  logLevel: 'debug' as LogLevel,
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


export function publishTracks(room: Room, tracks: LocalTrack[]) {
  const videoTrack = tracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const audioTrack = tracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  // console.log('publishTracks', tracks);

  const me = room.localParticipant;
  const priorities: Priorities = isRole('star')(me)
    ? { video: 'high', audio: 'high', data: 'standard' }
    : { video: 'low', audio: 'standard', data: 'standard' };

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

export function getLocalTracks(deviceIds: { video?: string, audio?: string } = {}) {
  return Video.createLocalTracks({
    video: {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      ...(deviceIds.video ? { deviceId: { exact: deviceIds.video } } : {}),
      name: `camera-${Date.now()}`,
    },
    audio: {
      ...(deviceIds.audio ? { deviceId: { exact: deviceIds.audio } } : {}),
    },
  })
    .catch((error) => {
    console.log('error getting tracks', error);
    throw error;
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
  'data-only' | 'audio' | 'focus' | 'focus-safer' | 'gallery' | 'listen' | 'watch' | 'nothing' | 'everything'

export function subscribe(roomSid: string, participantSid: string, policy: string = 'data_only',
                          focus: string[] = [], stars: string[] = []) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_SUBSCRIBE_ENDPOINT || '/subscribe';

  const esc = encodeURIComponent;

  // TODO remove stars parameter
  // TODO use a POST request for this
  const params = `${esc(roomSid)}/${esc(participantSid)}/${esc(policy)}?focus=${focus.map(esc).join(',')}&stars=${stars.map(esc)}`;
  const url = `${endpoint}/${params}`

  return fetchWithDelayReport(url, { headers });
}

export function checkForOperator(roomName: string) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_PARTICIPANTS_ENDPOINT || '/participants';

  const url = `${endpoint}/${encodeURIComponent(roomName)}`;

  return fetchWithDelayReport(url, { headers });
}


export type UserRole =
  'audience' | 'operator' | 'gallery' | 'foh' | 'lurker' | 'sign-interpreter' | 'star' | 'focus' | 'log' | 'comm'

export const getIdentity = (type: UserRole = 'lurker', username?: String) =>
  `${username || type}|${type}|${unixTime()}`;

export const getUsername = (identity: string) =>
  identity.split('|').slice(0, -2).join('|') || identity;

export const getParticipants = (room?: Room) => room ?
  [room.localParticipant, ...Array.from(room.participants.values())] : [];

export const parseRole = (identity: string) => element(-2)(identity.split('|'));
export const getRole = (p?: Participant) => p ? parseRole(p.identity) : undefined;

export const isRole = (type: UserRole) => (p?: Participant) => getRole(p) === type;

export const defaultRoom = () => isDev() ? 'dev-room3' : 'room3';

export const getTimestamp = (p?: Participant) => p ? element(-1)(p.identity.split('|')) : '';

export const sortedParticipants = (ps: Participant[]) => sortBy(ps, getTimestamp);
export const getIdentities = (ps: Participant[]) => ps.map((p) => p?.identity); // TODO why are some ps null?
export const sortedIdentities = (ps: Participant[]) => getIdentities(sortedParticipants(ps));

export const inGroup = (group: string[] = []) => (p?: Participant) => !!p && group.includes(p.identity);
export const sameIdentities = (a: Participant[], b: Participant[]) =>
  isEqual(sortedIdentities(a), sortedIdentities(b));

export const inGroups = (groups: string[][]) => (p?: Participant) =>
  !!p && groups.some((group) => group?.includes(p.identity));

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

export function getLocalVideoTrack(newOptions?: CreateLocalTrackOptions) {
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
  return fetch(`/disconnect/${room.sid}/${participant.sid}`);
}

export function clearRoom(room?: Room) {
  if (!room) return Promise.reject('No room!');
  return fetch(`/clear/${room.sid}`);
}

// for some reason typescript is saying LocalVideoTrackPublication has no priority or setPriority properties
// so we recast it to this
interface PrioritySettable {
  priority: Track.Priority,
  setPriority: (priority: Track.Priority) => void,
}

export function insureHighPriorityVideo(me: LocalParticipant) {
  me.videoTracks.forEach((pub) => {
    const pubWithPriorities = pub as unknown as PrioritySettable;
    if (pubWithPriorities.priority !== 'high') {
      pubWithPriorities.setPriority('high');
    }
  });
}

export function isStaffed(room: Room) {
  return Array.from(room.participants.values()).some(isRole('operator'));
}
