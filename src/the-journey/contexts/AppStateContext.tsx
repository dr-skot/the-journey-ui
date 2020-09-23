import React, { useCallback, useContext, useState } from 'react';
import { createContext, ReactNode, useEffect } from 'react';
import { Participant } from 'twilio-video';
import { AudioStreamContext, DEFAULT_DELAY, DEFAULT_GAIN } from './AudioStreamContext/AudioStreamContext';
import { TwilioRoomContext } from './TwilioRoomContext';
import { cached, isDev } from '../utils/react-help';
import RobustWebSocket from '../network/robust-web-socket';
type Identity = Participant.Identity;
export type Group = Identity[];

const serverUrl = isDev()
  ? 'ws:/localhost:8081'
  : window.location.origin.replace(/^http/, 'ws');
let server: RobustWebSocket;

interface RoomState {
  admitted: Identity[] | undefined,
  rejected: Identity[],
  mutedInLobby: Identity[],
  mutedInFocusGroup: Identity[],
  focusGroup: Identity[],
  gain: number,
  delayTime: number,
  muteAll: boolean,
  meetings: Group[];
  userAgents: Record<Identity, string>;
  helpNeeded: Identity[],
}
type Dispatcher = (action: string, payload: any) => void;
type RoomStateContextValue = [RoomState, Dispatcher];

const initialState = {
  admitted: undefined,
  rejected: [],
  mutedInLobby: [],
  focusGroup: [],
  mutedInFocusGroup: [],
  gain: DEFAULT_GAIN,
  delayTime: DEFAULT_DELAY,
  muteAll: false,
  meetings: [],
  userAgents: {},
  helpNeeded: [],
} as RoomState;

const initialStateChanger: Dispatcher = () => {};
const initalContextValue: RoomStateContextValue = [initialState, initialStateChanger];

export const AppStateContext = createContext(initalContextValue);

interface ServerMessage {
  action?: string,
  payload?: RoomState,
}

interface ProviderProps {
  children: ReactNode,
}

export default function RoomStateContextProvider({ children }: ProviderProps) {
  const [{ room }] = useContext(TwilioRoomContext);
  server = server || new RobustWebSocket(serverUrl);
  const [roomState, setRoomState] = useState<RoomState>(initialState);
  const { setGain, setDelayTime, setMuteAll } = useContext(AudioStreamContext);
  const me = room?.localParticipant.identity;

  // relay dispatch actions to server
  const dispatch = useCallback((action, payload = {}) => {
    server.send({ action, payload: { identity: me, roomName: room?.name, ...payload } });
  }, [server, me, room]);

  // receive room state updates
  useEffect(() => {
    function update(message: ServerMessage) {
      if (message.action === 'roomStateUpdate' && message.payload) {
        setRoomState(message.payload);
      }
    }
    server.addMessageListener(update);
    return () => server.removeMessageListener(update);
  }, [server, setRoomState]);

  // join and leave room
  useEffect(() => {
    if (room) {
      dispatch('joinRoom', { userAgent: navigator.userAgent });
      room.on('disconnected', () => dispatch('leaveRoom'));
    }
  }, [room, dispatch]);

  // wire gain and delayTime to the audio streams
  useEffect(() => { setGain(roomState.gain) },
    [roomState.gain, setGain]);
  useEffect(() => { setDelayTime(roomState.delayTime) },
    [roomState.delayTime, setDelayTime]);
  useEffect(() => { setMuteAll(roomState.muteAll) },
    [roomState.muteAll, setMuteAll]);

  const providerValue = cached('RoomStateContext.value').ifEqual([roomState, dispatch]);

  return <AppStateContext.Provider value={providerValue as RoomStateContextValue}>
    {children}
  </AppStateContext.Provider>
}

export const useRoomState = () => useContext(AppStateContext);
