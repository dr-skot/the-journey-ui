import Video, {
  Room,
  Participant,
  RemoteAudioTrackPublication,
  RemoteTrackPublication,
  LocalTrackPublication,
  LocalTrack,
  LocalVideoTrack, LocalAudioTrack, Track,
} from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import { Sid } from 'twilio/lib/interfaces';
import { element, tryToParse, unixTime } from './functional';
import { isDev } from './react-help';
import { isFunction, pick } from 'lodash';

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

export function getPublications(participant: Participant) {
  return Array.from(participant.tracks.values()) as (LocalTrackPublication | RemoteTrackPublication)[];
}

export const inGroup = (group: string[]) => (p: Participant) => group.includes(p.identity);


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

export const isRole = (type: UserRole) => (p?: Participant) =>
  p ? element(-2)(p.identity.split('|')) === type : false;

export const defaultRoom = () => isDev() ? 'dev-room' : 'room';

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

export const getTimestamp = (p: Participant) => element(-1)(p.identity.split('|'));

export const isAmong = (identities: string[]) => (p: Participant) => identities.includes(p.identity);

export const getStar = (participants: Map<string, Participant>) =>
  Array.from(participants.values()).find(isRole('star'));


//
// synchronized room data
//
type State = Record<string, any>
type StateChangeCallback = (changes: State) => void

export function newRoomStateManager() {
  let room: Room;
  let state: State = {};
  let listeners: StateChangeCallback[] = [];
  let publishedProps: string[] = [];

  function setRoom(newRoom: Room) {
    if (room) room.off('trackMessage', onMessageReceived)
    room = newRoom;
    room.on('trackMessage', onMessageReceived);
  }

  function setPublishedProps(props: string[]) {
    publishedProps = props;
  }

  function changeState(change: (prev: State) => State | State) {
    const changes = isFunction(change) ? change(state) : change;
    publish(changes); // TODO check publishedProps?
    state = { ...state, ...changes };
    return state;
  }

  function publish(data: State) {
    if (Object.values(data).length === 0) return;
    room.localParticipant.dataTracks.forEach((pub) => {
      pub.track.send(JSON.stringify({ 'changeRoomState': data }))
    });
  }

  function addListener(newListener: StateChangeCallback) {
    listeners = [...listeners, newListener];
  }

  function removeListener(listenerToRemove: StateChangeCallback) {
    listeners = listeners.filter((listener) => listener !== listenerToRemove);
  }

  function onMessageReceived(data: string) {
    const message = tryToParse(data);
    const changes = message?.changeRoomState;
    if (!changes) return;
    state = { ...state, ...changes };
    listeners.forEach(listener => listener(changes));
  }

  function onParticipantJoin() {
    const dataToPublish = pick(publishedProps, state);
    publish(dataToPublish);
  }

  return { setRoom, setPublishedProps, changeState, addListener, removeListener };
}
