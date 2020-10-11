import React, { useCallback, useContext, useState } from 'react';
import { createContext, ReactNode, useEffect } from 'react';
import { Participant } from 'twilio-video';
import { AudioStreamContext, DEFAULT_DELAY, DEFAULT_GAIN } from './AudioStreamContext/AudioStreamContext';
import { TwilioRoomContext } from './TwilioRoomContext';
import { cached, isDev } from '../utils/react-help';
import RobustWebSocket from '../network/robust-web-socket';
import useRoomName from '../hooks/useRoomName';
type Identity = Participant.Identity;
export type Group = Identity[];

const serverUrl = isDev() || window.location.origin.match(/localhost/)
  ? 'ws:/localhost:8081'
  : window.location.origin.replace(/^http/, 'ws');
let server: RobustWebSocket;

interface AppState {
  admitted: Group,
  rejected: Group,
  doorsClosed: string,
  mutedInFocusGroup: Group,
  focusGroup: Group,
  gain: number,
  delayTime: number,
  muteAll: boolean,
  meetings: Group[];
  userAgents: Record<Identity, string>;
  helpNeeded: Group,
  notReady: Group,
  excluded: Group,
  roommates: Group[],
}
type Dispatcher = (action: string, payload?: any) => void;
type AppStateContextValue = [AppState, Dispatcher];

const initialState = {
  admitted: [],
  rejected: [],
  doorsClosed: 'undefined',
  focusGroup: [],
  mutedInFocusGroup: [],
  gain: DEFAULT_GAIN,
  delayTime: DEFAULT_DELAY,
  muteAll: false,
  meetings: [],
  userAgents: {},
  helpNeeded: [],
  notReady: [],
  excluded: [],
  roommates: [],
} as AppState;

const initialStateChanger: Dispatcher = () => {};
const initalContextValue: AppStateContextValue = [initialState, initialStateChanger];

export const AppStateContext = createContext(initalContextValue);

interface ServerMessage {
  action?: string,
  payload?: AppState,
}

interface ProviderProps {
  children: ReactNode,
}

export default function AppStateContextProvider({ children }: ProviderProps) {
  server = server || new RobustWebSocket(serverUrl);
  const [{ room }] = useContext(TwilioRoomContext);
  const roomName = useRoomName();
  const [appState, setAppState] = useState<AppState>(initialState);
  const { setGain, setDelayTime, setMuteAll } = useContext(AudioStreamContext);
  const me = room?.localParticipant.identity;

  // relay dispatch actions to server
  const dispatch = useCallback((action, payload = {}) => {
    console.log('dispatch', action, payload);
    server.send({ action, payload: { identity: me, roomName: room?.name, ...payload } });
  },  [me, room]);

  // ping server periodically to keep alive... and get updated room state in case it's gone stale
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      // server.send({ action: 'ping' });
      dispatch('getRoomState');
    }, 10000);
    return () => window.clearInterval(intervalId);
  }, [dispatch]);

  // receive room state updates
  useEffect(() => {
    function update(message: ServerMessage) {
      if (message.action === 'roomStateUpdate' && message.payload) {
        setAppState(message.payload);
      }
    }
    server.addMessageListener(update);
    // then request room state right away, even before twilio room is joined
    dispatch('getRoomState', { roomName });
    return () => server.removeMessageListener(update);
  }, [setAppState, roomName, dispatch]);

  // join and leave room
  useEffect(() => {
    if (room) {
      dispatch('joinRoom', { userAgent: navigator.userAgent });
      room.on('disconnected', () => dispatch('leaveRoom'));
    }
  }, [room, dispatch]);

  // wire gain and delayTime to the audio streams
  useEffect(() => { setGain(appState.gain) },
    [appState.gain, setGain]);
  useEffect(() => { setDelayTime(appState.delayTime) },
    [appState.delayTime, setDelayTime]);
  useEffect(() => { setMuteAll(appState.muteAll) },
    [appState.muteAll, setMuteAll]);

  const cachedIfEqual = (propName: keyof AppState) =>
    cached(`RoomState.${propName}`).ifEqual(appState[propName])

  const appStateWithCaching = {
    admitted: cachedIfEqual('admitted'),
    rejected: cachedIfEqual('rejected'),
    doorsClosed: cachedIfEqual('doorsClosed'),
    focusGroup: cachedIfEqual('focusGroup'),
    mutedInFocusGroup: cachedIfEqual('mutedInFocusGroup'),
    gain: cachedIfEqual('gain'),
    delayTime: cachedIfEqual('delayTime'),
    muteAll: cachedIfEqual('muteAll'),
    meetings: cachedIfEqual('meetings'),
    userAgents: cachedIfEqual('userAgents'),
    helpNeeded: cachedIfEqual('helpNeeded'),
    notReady: cachedIfEqual('notReady'),
    excluded: cachedIfEqual('excluded'),
    roommates: cachedIfEqual('roommates'),
  };

  const providerValue = cached('AppStateProvider.value')
    .ifEqual([appStateWithCaching, dispatch])

  return <AppStateContext.Provider value={providerValue as AppStateContextValue}>
    {children}
  </AppStateContext.Provider>
}

export const useAppState = () => useContext(AppStateContext);
