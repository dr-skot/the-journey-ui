import Video, {
  Room,
  Participant,
  RemoteAudioTrackPublication,
  RemoteTrackPublication,
  LocalTrackPublication,
  LocalTrack,
  CreateLocalTrackOptions,
} from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import { Sid } from 'twilio/lib/interfaces';
import { useCallback } from 'react';

const DEFAULT_OPTIONS = {
  // tracks: [],
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
    console.log('tracks', tracks);
    publishTracks(room, tracks);
    return room
  });
}

function publishTracks(room: Room, tracks: LocalTrack[]) {
  tracks.forEach(track => {
    // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
    // However, tracks must be published manually in order to set the priority on them.
    // All video tracks are published with 'low' priority. This works because the video
    // track that is displayed in the 'MainParticipant' component will have it's priority
    // set to 'high' via track.setPriority()
    if (track)
      room.localParticipant.publishTrack(track, { priority: track.kind === 'video' ? 'low' : 'standard' })
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
