import React, { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { createContext } from 'react';
import { joinRoom, getTracks, getLocalTracks, subscribe } from '../utils/twilio';
import {
  Room,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
  RemoteTrackPublication,
  RemoteVideoTrackPublication,
  TwilioError, RemoteParticipant, RemoteTrack, LocalVideoTrack, LocalAudioTrack, LocalDataTrack, Participant,
} from 'twilio-video';
import { Sid } from 'twilio/lib/interfaces';
import { constrain, toggleMembership } from '../utils/functional';
import { initialSettings, Settings, settingsReducer } from './settings/settingsReducer';
import generateConnectionOptions from '../../twilio/utils/generateConnectionOptions/generateConnectionOptions';
import useLocalTracks from '../../twilio/components/VideoProvider/useLocalTracks/useLocalTracks';
import { useLocalVideoTrack } from '../hooks/useLocalVideoTrack';
import { AudioOut, getAudioOut, setDelay, setGain } from '../utils/audio';

type Identity = Participant.Identity;

const DEFAULT_GAIN = 0.8;

interface AppState {
  error?: TwilioError,
  userType: 'audience' | 'operator' | 'gallery',
  localTracks: (LocalAudioTrack | LocalVideoTrack)[], // TODO separate these
  localDataTrack?: LocalDataTrack,
  room?: Room,
  roomStatus: 'disconnected' | 'connecting' | 'connected',
  participants: Map<Sid, RemoteParticipant>,
  starParticipant: undefined,
  focusGroup: Identity[];
  tracks: Map<Sid, Map<Identity, RemoteTrackPublication>>
  audioTracks: Map<Identity, Map<Sid, RemoteAudioTrackPublication>>,
  videoTracks: Map<Identity, Map<Sid, RemoteVideoTrackPublication>>,
  dataTracks: Map<Identity, Map<Sid, RemoteDataTrackPublication>>,
  audioOut?: AudioOut,
  audioDelay: number,
  audioGain: number,
  activeSinkId: string,
  settings: Settings,
}

const initialState: AppState = {
  error: undefined,
  userType: 'audience',
  localTracks: [],
  localDataTrack: undefined,
  room: undefined,
  roomStatus: 'disconnected',
  participants: new Map(),
  focusGroup: [],
  starParticipant: undefined,
  tracks: new Map(),
  audioTracks: new Map(),
  videoTracks: new Map(),
  dataTracks: new Map(),
  audioOut: undefined,
  audioDelay: 0,
  audioGain: 1,
  activeSinkId: 'default',
  settings: initialSettings,
};

type AppContextValue = [AppState, EasyDispatch];
export const AppContext = createContext([initialState, () => {}] as AppContextValue);

type ReducerAction = 'setAudioOut' | 'getLocalTracks' | 'gotLocalTracks' | 'joinRoom' | 'roomJoined' |
  'roomJoinFailed' | 'setRoomStatus' | 'roomDisconnected' | 'participantConnected' | 'participantDisconnected' |
  'trackSubscribed' | 'trackUnsubscribed' | 'subscribe' | 'clearFocus' | 'toggleFocus' | 'publishDataTrack' |
  'publishedDataTrack' | 'broadcast' | 'messageReceived' | 'bumpAudioDelay' | 'bumpAudioGain' | 'setSinkId' |
  'changeSetting' | 'toggleStar'

interface ReducerRequest {
  action: ReducerAction,
  payload: any,
  dispatch: EasyDispatch,
}

type EasyDispatch = (action: ReducerAction, payload?: any) => void;

const reducer: React.Reducer<AppState, ReducerRequest> = (state: AppState, request: ReducerRequest) => {
  const { action, payload, dispatch } = request;
  console.log('action', action);
  let newState = state;

  const broadcast = (message: any) => { state.localDataTrack?.send(JSON.stringify(message)); return message };

  switch (action) {

    case 'setAudioOut':
      console.log('audio output set!', payload);
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
      console.log("joining with identity", payload.identity);
      console.log('joining with tracks', state.localTracks);
      joinRoom(payload.roomName, payload.identity,
        {...generateConnectionOptions(state.settings), ...payload.options }, state.localTracks)
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
      console.log('localParticipants tracks', payload.room.localParticipant.tracks);
      document.addEventListener('beforeunload', payload.room.disconnect);
      payload.room.on('disconnected', (room: Room, error: TwilioError) =>
        dispatch('roomDisconnected', { room, error }));
      payload.room.on('reconnecting', () =>
        dispatch('setRoomStatus', { status: 'connecting' }));
      payload.room.on('reconnected', () =>
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

    case 'broadcast':
      newState = { ...state, ...broadcast(payload) };
      break;

    case 'messageReceived':
      console.log('message recieved!', payload);
      if (payload.audioDelay) newState = { ...newState, audioDelay: setDelay(payload.audioDelay, newState.audioOut) };
      if (payload.audioGain) newState = { ...newState, audioGain: setGain(payload.audioGain, newState.audioOut) };
      if (payload.focusGroup) newState = { ...newState, focusGroup: payload.focusGroup };
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

    case 'toggleStar':
      newState = { ...state,
        starParticipant: state.starParticipant === payload.star ? undefined : payload.star };
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
  }, []);

  // once we have an audio out, set the gain to DEFAULT_GAIN
  useEffect(() => {
    if (state.audioOut) dispatch('bumpAudioGain', { bump: DEFAULT_GAIN - state.audioGain });
  }, [!state.audioOut]);

  return <AppContext.Provider value={[state, dispatch]}>
    {children}
  </AppContext.Provider>
}
