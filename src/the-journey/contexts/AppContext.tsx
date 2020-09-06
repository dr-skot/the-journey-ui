import React, { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { createContext } from 'react';
import { joinRoom, getTracks, getLocalTracks, subscribe, getIdentity } from '../utils/twilio';
import {
  Room,
  RemoteAudioTrackPublication,
  RemoteTrackPublication,
  TwilioError, RemoteParticipant, RemoteTrack, LocalVideoTrack, LocalAudioTrack, LocalDataTrack, Participant,
} from 'twilio-video';
import { Sid } from 'twilio/lib/interfaces';
import { toggleMembership, tryToParse } from '../utils/functional';
import { initialSettings, Settings, settingsReducer } from './settings/settingsReducer';
import generateConnectionOptions from '../../twilio/utils/generateConnectionOptions/generateConnectionOptions';
import { AudioOut, getAudioOut, setDelay, setGain } from '../utils/audio';

// TODO maintain participants as an array
// TODO maintain track arrays as well, based on events

type Identity = Participant.Identity;

const DEFAULT_GAIN = 0.8;

interface AppState {
  error?: TwilioError,
  // room
  room?: Room,
  roomStatus: 'disconnected' | 'connecting' | 'connected',
  // local tracks
  localTracks: (LocalAudioTrack | LocalVideoTrack)[], // TODO separate these
  localDataTrack?: LocalDataTrack,
  // remote tracks
  audioTracks: Map<Identity, Map<Sid, RemoteAudioTrackPublication>>,

  // shared state
  focusGroup: Identity[];
  admitted: Identity[],
  rejected: Identity[],
  mutedInLobby: Identity[],
  audioDelay: number,
  audioGain: number,

  // local
  audioOut?: AudioOut,
  activeSinkId: string,
  // settings
  settings: Settings,
}

const initialState: AppState = {
  error: undefined,
  // room
  room: undefined,
  roomStatus: 'disconnected',
  // local tracks
  localTracks: [],
  localDataTrack: undefined,
  // remote tracks
  audioTracks: new Map(),

  // shared state
  // participants
  focusGroup: [],
  // lobby
  admitted: [],
  rejected: [],
  mutedInLobby: [],
  audioDelay: 0,
  audioGain: 1,

  // local state
  // audio
  audioOut: undefined,
  activeSinkId: 'default',
  // settings
  settings: initialSettings,
};

type AppContextValue = [AppState, EasyDispatch];
export const AppContext = createContext([initialState, () => {}] as AppContextValue);

type ReducerAction = 'setAudioOut' | 'getLocalTracks' | 'gotLocalTracks' | 'joinRoom' | 'roomJoined' |
  'roomJoinFailed' | 'setRoomStatus' | 'roomDisconnected' | 'participantConnected' | 'participantDisconnected' |
  'trackSubscribed' | 'trackUnsubscribed' | 'subscribe' | 'clearFocus' | 'toggleFocus' | 'publishDataTrack' |
  'publishedDataTrack' | 'unpublishDataTrack' | 'broadcast' | 'messageReceived' | 'bumpAudioDelay' | 'bumpAudioGain' | 'setSinkId' |
  'changeSetting' | 'admit' | 'reject' | 'toggleMute'

interface ReducerRequest {
  action: ReducerAction,
  payload: any,
  dispatch: EasyDispatch,
}

type EasyDispatch = (action: ReducerAction, payload?: any) => void;

const reducer: React.Reducer<AppState, ReducerRequest> = (state: AppState, request: ReducerRequest) => {
  const { action, payload, dispatch } = request;
  console.log('action', action, 'payload', payload);
  let newState = state;

  const broadcast = (message: any) => { state.localDataTrack?.send(JSON.stringify(message)); return message };

  switch (action) {

    case 'setAudioOut':
      newState = { ...state, audioOut: payload.audioOut };
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
      console.log('joining with tracks', state.localTracks); // TODO allow payload tracks
      joinRoom(payload.roomName, getIdentity(payload.role, payload.username),
        {...generateConnectionOptions(state.settings), ...payload.options }, state.localTracks)
        .then((room) => {
          dispatch('roomJoined', { room, ...payload });
          if (payload.then) payload.then(room);
        })
        .catch((error) => {
          dispatch('roomJoinFailed', { error });
          if (payload.catch) payload.catch(error);
        });
      newState = { ...state, roomStatus: 'connecting' };
      break;

    case 'roomJoined':
      document.addEventListener('beforeunload', payload.room.disconnect);
      payload.room.on('disconnected', (room: Room, error: TwilioError) =>
        dispatch('roomDisconnected', { room, error }));
      payload.room.on('reconnecting', () =>
        dispatch('setRoomStatus', { status: 'connecting' }));
      payload.room.on('reconnected', () =>
        dispatch('setRoomStatus', { status: 'connected' }));
      payload.room.on('trackSubscribed',
        (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) =>
          dispatch('trackSubscribed', { track, publication, participant }));
      payload.room.on('trackUnsubscribed',
        (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) =>
          dispatch('trackUnsubscribed', { track, publication, participant }));
      payload.room.on('trackMessage', (data: string) => {
          console.log('raw data received', data);
          try { const message = tryToParse(data); dispatch('messageReceived', message) }
          finally {}
        });
      console.log('connected to room', payload.room, 'with participants', payload.room.participants)
      newState = {
        ...state, room: payload.room, roomStatus: 'connected',
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
      };
      break;

    case 'trackSubscribed':
    case 'trackUnsubscribed':
      console.log('track subscriptions changed')
      newState = {
        ...state,
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

    case 'unpublishDataTrack':
      state.room?.localParticipant.dataTracks.forEach((pub) => pub.unpublish());
      return { ...state,  localDataTrack: undefined };

    case 'publishedDataTrack':
      newState = { ...state, localDataTrack: payload.track };
      break;

    case 'broadcast':
      newState = { ...state, ...broadcast(payload) };
      break;

      // TODO consolidate message send and receive so this isn't so hart to crosscheck
    case 'messageReceived':
      console.log('message recieved!', payload);
      if (payload.audioDelay) newState = { ...newState, audioDelay: setDelay(payload.audioDelay, newState.audioOut) };
      if (payload.audioGain) newState = { ...newState, audioGain: setGain(payload.audioGain, newState.audioOut) };
      if (payload.focusGroup) newState = { ...newState, focusGroup: payload.focusGroup };
      if (payload.admitted) newState = { ...newState, admitted: payload.admitted };
      if (payload.rejected) newState = { ...newState, rejected: payload.rejected };
      break;

    case 'bumpAudioDelay':
      newState = { ...state, ...broadcast({
          audioDelay: setDelay(state.audioDelay + payload.bump, state.audioOut)
      }) }
      break;

    case 'bumpAudioGain':
      newState = { ...state, ...broadcast({
          audioGain: setGain(state.audioGain + payload.bump, state.audioOut)
        }) };
      break;

    case 'setSinkId':
      newState = { ...state, activeSinkId: payload.sinkId };
      break;

    case 'changeSetting':
      newState = { ...state, settings: settingsReducer(state.settings, payload) };
      break;

    case 'admit':
      newState = { ...state,
        ...broadcast({ admitted: [...state.admitted, ...payload.identities ] }) };
      break;

    case 'reject':
      newState = { ...state,
        ...broadcast({ rejected: [...state.rejected, ...payload.identities ] })  };
      break;

    case 'toggleMute':
      newState = { ...state,
        ...broadcast({ mutedInLobby: toggleMembership(state.mutedInLobby)(payload.identity) })  };
      break;
  }

  return newState;
}

interface ChildrenProps {
  children: ReactNode,
}

export default function AppContextProvider({ children }: ChildrenProps) {
  const [state, _dispatch] = useReducer(reducer, initialState, undefined);

  // pass dispatch to _dispatch, for promise resolving
  const dispatch = useCallback((action: ReducerAction, payload = {}) => {
    _dispatch({ action, payload, dispatch });
  }, [_dispatch]);

  // set the audio output when AudioContext becomes available
  useEffect(() => {
    const { audioDelay, audioGain } = state;
    getAudioOut(32, audioDelay, audioGain)
      .then(audioOut => dispatch('setAudioOut', { audioOut }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only once at startup

  // once we have an audio out, set the gain to DEFAULT_GAIN
  useEffect(() => {
    if (state.audioOut) dispatch('bumpAudioGain', { bump: DEFAULT_GAIN - state.audioGain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!state.audioOut]); // only when audioOut initializes

  return <AppContext.Provider value={[state, dispatch]}>
    {children}
  </AppContext.Provider>
}
