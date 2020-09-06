import React, { ReactNode, useCallback, useReducer } from 'react';
import { createContext } from 'react';
import { joinRoom, getLocalTracks, getIdentity } from '../utils/twilio';
import { Room, TwilioError, LocalVideoTrack, LocalAudioTrack, LocalDataTrack } from 'twilio-video';
import { initialSettings, Settings, settingsReducer } from './settings/settingsReducer';
import generateConnectionOptions from '../../twilio/utils/generateConnectionOptions/generateConnectionOptions';

// TODO maintain participants as an array
// TODO maintain track arrays as well, based on events

interface AppState {
  error?: TwilioError,

  room?: Room,
  roomStatus: 'disconnected' | 'connecting' | 'connected',

  localTracks: (LocalAudioTrack | LocalVideoTrack)[],
  localDataTrack?: LocalDataTrack,

  activeSinkId: string,
  settings: Settings,
}

const initialState: AppState = {
  error: undefined,

  room: undefined,
  roomStatus: 'disconnected',

  localTracks: [],
  localDataTrack: undefined,

  activeSinkId: 'default', // TODO study the significance of this
  settings: initialSettings,
};

type AppContextValue = [AppState, EasyDispatch];
export const AppContext = createContext([initialState, () => {}] as AppContextValue);

type ReducerAction = 'setAudioOut' | 'getLocalTracks' | 'gotLocalTracks' | 'joinRoom' | 'roomJoined' |
  'roomJoinFailed' | 'setRoomStatus' | 'roomDisconnected' | 'setSinkId' | 'changeSetting'

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

  switch (action) {

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
      window.addEventListener('beforeunload', payload.room.disconnect);
      payload.room.on('disconnected', (room: Room, error: TwilioError) =>
        dispatch('roomDisconnected', { room, error }));
      payload.room.on('reconnecting', () =>
        dispatch('setRoomStatus', { status: 'connecting' }));
      payload.room.on('reconnected', () =>
        dispatch('setRoomStatus', { status: 'connected' }));
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

  return <AppContext.Provider value={[state, dispatch]}>
    {children}
  </AppContext.Provider>
}
