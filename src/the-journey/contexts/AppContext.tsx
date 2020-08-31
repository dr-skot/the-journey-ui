import React, { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { createContext } from 'react';
import { joinRoom, getTracks, getLocalTracks, subscribe } from '../utils/twilio';
import {
  Room,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
  RemoteTrackPublication,
  RemoteVideoTrackPublication,
  TwilioError, RemoteParticipant, RemoteTrack, LocalVideoTrack, LocalAudioTrack, LocalDataTrack,
} from 'twilio-video';
import { Sid } from 'twilio/lib/interfaces';
import { toggleMembership } from '../utils/functional';

class LocalAUdioTrack {
}

interface AppState {
  error?: TwilioError,
  userType: 'audience' | 'operator' | 'gallery',
  localTracks: (LocalAudioTrack | LocalVideoTrack)[], // TODO separate these
  localDataTrack?: LocalDataTrack,
  room?: Room,
  roomStatus: 'disconnected' | 'connecting' | 'connected',
  participants: Map<Sid, RemoteParticipant>,
  tracks: Map<Sid, Map<Sid, RemoteTrackPublication>>
  audioTracks: Map<Sid, Map<Sid, RemoteAudioTrackPublication>>,
  videoTracks: Map<Sid, Map<Sid, RemoteVideoTrackPublication>>,
  dataTracks: Map<Sid, Map<Sid, RemoteDataTrackPublication>>,
  focusGroup: Sid[];
  audioContext: AudioContext,
  audioDelay: number,
}

const initialState: AppState = {
  error: undefined,
  userType: 'audience',
  localTracks: [],
  localDataTrack: undefined,
  room: undefined,
  roomStatus: 'disconnected',
  participants: new Map(),
  tracks: new Map(),
  audioTracks: new Map(),
  videoTracks: new Map(),
  dataTracks: new Map(),
  focusGroup: [],
  audioContext: new AudioContext(),
  audioDelay: 0,
};

type EasyDispatch = (action: string, payload?: any) => void;

type AppContextValue = [AppState, EasyDispatch];
export const AppContext = createContext([initialState, () => {}] as AppContextValue);

interface ReducerRequest {
  action: string,
  payload: any,
  dispatch: EasyDispatch,
}

const reducer: React.Reducer<AppState, ReducerRequest> = (state: AppState, request: ReducerRequest) => {
  const { action, payload, dispatch } = request;
  console.log('action', action);
  let newState = state;

  const broadcast = (message: any) => { state.localDataTrack?.send(JSON.stringify(message)); return message };

  switch (action) {

    case 'getAudioContext':
      newState = state.audioContext ? state : { ...state, audioContext: new AudioContext() };
      break;

    case 'getLocalTracks':
      getLocalTracks()
        .then(tracks => {
          dispatch('gotLocalTracks', { tracks });
          if (payload.then) payload.then(tracks);
        });
      break;

    case 'gotLocalTracks':
      newState = { ...state, localTracks: payload.tracks };
      break;

    case 'joinRoom':
      if (state.room) state.room.disconnect();
      console.log("joining with identity", payload.identity);
      joinRoom(payload.roomName, payload.identity, payload.options)
        .then((room) => {
          dispatch('roomJoined', { room, ...payload });
          if (payload.then) payload.then(room);
        })
        .catch((error) => {
          dispatch('roomJoinFailed');
          if (payload.catch) payload.catch(error);
        });
      newState = { ...state, roomStatus: 'connecting' };
      break;

    case 'roomJoined':
      document.addEventListener('beforeunload', payload.room.disconnect);
      payload.room.on('disconnected', (room: Room, error: TwilioError) =>
        dispatch('roomDisconnected', { room, error }));
      payload.room.on('reconnecting', (room: Room) =>
        dispatch('setRoomStatus', { status: 'connecting' }));
      payload.room.on('reconnected', (room: Room) =>
        dispatch('setRoomStatus', { status: 'connected' }));
      payload.room.on('participantConnected', (participant: RemoteParticipant) =>
        dispatch('participantConnected', { participant }));
      payload.room.on('participantDisconnected', (participant: RemoteParticipant) =>
        dispatch('participantDisconnected', { participant }));
      payload.room.on('trackSubscribed',
        (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) =>
          dispatch('trackSubscribed', { track, publication, participant }));
      payload.room.on('trackUnsubscribed',
        (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) =>
          dispatch('trackUnsubscribed', { track, publication, participant }));
      payload.room.on('trackMessage', (data: string) => {
          try { const message = JSON.parse(data); dispatch('messageReceived', message) }
          finally {}
        });
      console.log('connected to room', payload.room, 'with participants', payload.room.participants)
      newState = {
        ...state, room: payload.room, roomStatus: 'connected',
        participants: new Map(payload.room.participants)
      };
      break;

    case 'roomJoinFailed':
      newState = { ...state, error: payload.error, roomStatus: 'disconnected' };
      break;

    case 'setRoomStatus':
      newState = { ...state, roomStatus: payload.status };
      break;

    case 'roomDisconnected':
      // TODO whatever cleanup is needed
      newState = {
        ...state, room: undefined, roomStatus: 'disconnected', error: payload.error,
        participants: new Map(), tracks: new Map()
      };
      break;

    case 'participantConnected':
    case 'participantDisconnected':
      newState = { ...state, participants: new Map(state.room!.participants) };
      break;

    case 'trackSubscribed':
    case 'trackUnsubscribed':
      newState = {
        ...state,
        tracks: getTracks(state.room!),
        [`${payload.track.kind}Tracks`]: getTracks(state.room!, payload.track.kind)
      };
      break;

    case 'subscribe':
      subscribe(payload.roomName || state.room?.name,
        payload.identity || state.room?.localParticipant.identity,
        payload.profile || 'data-only',
        payload.focus || state.focusGroup)
        .then(result => payload.then?.(result))
        .catch(error => payload.catch?.(error));
      break;

    case 'clearFocus':
      newState = { ...state, ...broadcast({ focusGroup: [] }) };
      break;

    case 'toggleFocus':
      newState = {
        ...state,
        ...broadcast({ focusGroup: toggleMembership(state.focusGroup)(payload.identity) }),
      };
      break;

    case 'publishDataTrack':
      if (!state.localDataTrack) {
        state.room?.localParticipant.publishTrack(new LocalDataTrack())
          .then(pub => dispatch('publishedDataTrack', { track: pub.track }));
      }
      break;

    case 'publishedDataTrack':
      newState = { ...state, localDataTrack: payload.track };
      break;

    case 'messageReceived':
      newState = { ...state, ...payload } // TODO validate & sanitize message first
      break;

    case 'bumpAudioDelay':
      newState = { ...state, ...broadcast({ audioDelay: state.audioDelay + payload.bump }) }
      break;
  }

  return newState;
}

interface ChildrenProps {
  children: ReactNode,
}

export default function AppContextProvider({ children }: ChildrenProps) {
  const [state, _dispatch] = useReducer(reducer, initialState, undefined);

  // pass dispatch to _dispatch
  const dispatch = useCallback((action, payload = {}) => {
    _dispatch({ action, payload, dispatch });
  }, [_dispatch]);

  // get an AudioContext on first user interaction
  useEffect(() => {
    console.log('audiocontext', state.audioContext);
    if (state.audioContext) return;

    function getAudioContext() {
      console.log('trying for an audiocontext');
      dispatch('getAudioContext');
    }

    document.addEventListener('click', getAudioContext);
    document.addEventListener('keydown', getAudioContext);
    return () => {
      document.removeEventListener('click', getAudioContext);
      document.removeEventListener('keydown', getAudioContext);
    }
  }, [state.audioContext]);

  return <AppContext.Provider value={[state, dispatch]}>
    {children}
  </AppContext.Provider>
}
