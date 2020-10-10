import React, { ReactNode, useCallback, useContext, useReducer } from 'react';
import { createContext } from 'react';
import { joinRoom, getLocalTracks, getIdentity, subscribe, toggleVideoEnabled } from '../utils/twilio';
import { Room, TwilioError, LocalVideoTrack, LocalAudioTrack, LocalDataTrack, LocalTrack } from 'twilio-video';
import { initialSettings, Settings, settingsReducer } from './settings/settingsReducer';
import generateConnectionOptions from '../../twilio/utils/generateConnectionOptions/generateConnectionOptions';
import { cached } from '../utils/react-help';
import LogRocket from 'logrocket';

interface TwilioState {
  error?: TwilioError,

  room?: Room,
  roomStatus: 'disconnected' | 'connecting' | 'connected',

  localTracks: (LocalAudioTrack | LocalVideoTrack)[],
  localDataTrack?: LocalDataTrack,
  mediaPermissionDenied: boolean,

  activeSinkId: string,
  settings: Settings,
}

const initialState: TwilioState = {
  error: undefined,

  room: undefined,
  roomStatus: 'disconnected',

  localTracks: [],
  localDataTrack: undefined,
  mediaPermissionDenied: false,

  activeSinkId: 'default', // TODO study the significance of this
  settings: initialSettings,
};

type TwilioRoomContextValue = [TwilioState, EasyDispatch];
export const TwilioRoomContext = createContext([initialState, () => {}] as TwilioRoomContextValue);

type ReducerAction = 'setAudioOut' | 'getLocalTracks' | 'gotLocalTracks' | 'joinRoom' | 'roomJoined' |
  'roomJoinFailed' | 'setRoomStatus' | 'roomDisconnected' | 'setSinkId' | 'changeSetting' | 'subscribe' |
  'toggleVideoEnabled' | 'getLocalAudioTrack' | 'getLocalTracksFailed'

interface ReducerRequest {
  action: ReducerAction,
  payload: any,
  dispatch: EasyDispatch,
}

type EasyDispatch = (action: ReducerAction, payload?: any) => void;

const reducer: React.Reducer<TwilioState, ReducerRequest> = (state: TwilioState, request: ReducerRequest) => {
  const { action, payload, dispatch } = request;
  // console.log('action', action, 'payload', payload);
  let newState = state;

  switch (action) {

    case 'toggleVideoEnabled':
      toggleVideoEnabled(state.room, state.localTracks)
        .then((tracks) => { if (tracks) dispatch('gotLocalTracks', { tracks }) });
      break;

    case 'getLocalTracks':
      getLocalTracks(payload.deviceIds)
        .then(tracks => {
          dispatch('gotLocalTracks', { tracks });
          if (payload.then) payload.then(tracks);
        })
        .catch(error => {
          dispatch('getLocalTracksFailed', { error });
          if (payload.catch) payload.catch(error);
        })
      break;

    case 'gotLocalTracks':
      newState = { ...state, localTracks: payload.tracks, mediaPermissionDenied: false };
      break;

    case 'getLocalTracksFailed':
      // TODO don't assume permission denied is the reason, check the error
      console.log('getLocalTracksFailed', payload.error);
      newState = { ...state, error: payload.error, mediaPermissionDenied: true };
      break;

    case 'joinRoom':
      if (state.room) state.room.disconnect();
      const identity = payload.identity || getIdentity(payload.role, payload.username);
      LogRocket.identify(identity);
      joinRoom(payload.roomName, identity,
        generateConnectionOptions({...state.settings, ...payload.options }), state.localTracks)
        .then((room) => {
          console.log('joined room', room.name, 'with identity', identity);
          room.setMaxListeners(31); // TODO find leak instead
          dispatch('roomJoined', { room, ...payload });
          if (payload.then) payload.then(room);
        })
        .catch((error) => {
          console.log('room join failed!')
          dispatch('roomJoinFailed', { error });
          if (payload.catch) payload.catch(error);
        });
      newState = { ...state, roomStatus: 'connecting' };
      break;

    case 'roomJoined':
      window.addEventListener('beforeunload', payload.room.disconnect);
      payload.room.on('disconnected', (room: Room, error: TwilioError) =>
        dispatch('roomDisconnected', { room, error }));
      payload.room.on('reconnecting', () =>
        dispatch('setRoomStatus', { status: 'connecting' }));
      payload.room.on('reconnected', () =>
        dispatch('setRoomStatus', { status: 'connected' }));
      payload.room.setMaxListeners(25);
      /*
      payload.room.localParticipant.on('trackDisabled', (track: LocalTrack) =>
        console.log('trackDisabled', track));
      payload.room.localParticipant.on('trackEnabled', (track: LocalTrack) =>
        console.log('trackEnabled', track));
      payload.room.localParticipant.on('trackPublished', (track: LocalTrack) =>
        console.log('trackPublished', track));
      payload.room.localParticipant.on('trackPublicationFailed', (track: LocalTrack) =>
        console.log('trackPublicationFailed', track));
      payload.room.localParticipant.on('trackStarted', (track: LocalTrack) =>
        console.log('trackStarted', track));
      payload.room.localParticipant.on('trackStopped', (track: LocalTrack) =>
        console.log('trackStopped', track));
       */
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

    case 'setSinkId':
      newState = { ...state, activeSinkId: payload.sinkId };
      break;

    case 'changeSetting':
      newState = { ...state, settings: settingsReducer(state.settings, payload) };
      break;

    case 'subscribe':
      if (state.room) {
        // console.log('requesting subscription change', payload);
        subscribe(state.room.sid, state.room.localParticipant.sid, payload.profile, payload.focus, payload.stars)
          .then();
      }
      break;

  }

  return newState;
}

interface ChildrenProps {
  children: ReactNode,
}

export default function TwilioRoomContextProvider({ children }: ChildrenProps) {
  const [state, _dispatch] = useReducer(reducer, initialState, undefined);

  // pass dispatch to _dispatch, for promise resolving
  const dispatch = useCallback((action: ReducerAction, payload = {}) => {
    _dispatch({ action, payload, dispatch });
  }, [_dispatch]);

  console.log('TwilioRoomContext.Provider rerender');
  // reportEqual({ state, dispatch });
  const providerValue =
    cached('TwilioRoomContext.value').ifEqual([state, dispatch]) as TwilioRoomContextValue;

  return <TwilioRoomContext.Provider value={providerValue}>
    {children}
  </TwilioRoomContext.Provider>
}

export function useTwilioRoomContext() { return useContext(TwilioRoomContext ) }
