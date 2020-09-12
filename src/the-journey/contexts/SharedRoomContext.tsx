import React, { useCallback, useContext, useState } from 'react';
import { createContext, ReactNode, useEffect } from 'react';
import { Participant } from 'twilio-video';
import { getLocalDataTrack } from '../utils/twilio';
import { tryToParse } from '../utils/functional';
import { isEqual } from 'lodash';
import { AudioStreamContext, DEFAULT_DELAY, DEFAULT_GAIN } from './AudioStreamContext/AudioStreamContext';
import { AppContext } from './AppContext';
import { prevIfEqual } from '../utils/react-help';

type Identity = Participant.Identity;

interface SharedRoomState {
  admitted: Identity[] | undefined,
  rejected: Identity[],
  mutedInLobby: Identity[],
  focusGroup: Identity[],
  gain: number,
  delayTime: number,
}
type StateChanger = (changes: SharedRoomState) => void;
type SharedRoomContextValue = [SharedRoomState, StateChanger];

// a separate type for partial states, to make typescript happy
export interface RoomStateChange {
  admitted?: Identity[],
  rejected?: Identity[],
  mutedInLobby?: Identity[],
  focusGroup?: Identity[],
  gain?: number,
  delayTime?: number;
}

const initialState = {
  admitted: undefined,
  rejected: [],
  mutedInLobby: [],
  focusGroup: [],
  gain: DEFAULT_GAIN,
  delayTime: DEFAULT_DELAY,
} as SharedRoomState;
const initialStateChanger: StateChanger = () => {};
const initalContextValue: SharedRoomContextValue = [initialState, initialStateChanger];

export const SharedRoomContext = createContext(initalContextValue);

interface QueuedMessage {
  to: Identity | 'all',
  attempt?: number,
  payload: { request: 'sharedState' } | { sharedStateUpdate: RoomStateChange },
}

interface ProviderProps {
  children: ReactNode,
}

export default function SharedRoomContextProvider({ children }: ProviderProps) {
  const [{ room }] = useContext(AppContext);
  const [queue, setQueue] = useState<QueuedMessage[]>([]);
  const [sharedState, setSharedState] = useState<SharedRoomState>(initialState);
  const { setGain, setDelayTime } = useContext(AudioStreamContext);
  const me = room?.localParticipant.identity;

  // queue messages
  const sendMessage = useCallback((message: QueuedMessage) => {
    setQueue((prev) => [...prev, message]);
  }, [setQueue]);

  // return-address and send queued messages when we have a data track
  useEffect(() => {
    if (!room || queue.length === 0) return;
    getLocalDataTrack(room).then((track) => {
      queue.forEach((message) => {
        console.log('sending data track message', message);
        track.send(JSON.stringify({ ...message, from: me }));
      });
    });
    setQueue([]);
  }, [room, queue])

  // listen for shared state updates, then request an update
  useEffect(() => {
    if (!room) return;

    function syncSharedState(data: string) {
      const message = tryToParse(data) || {};
      const { from, to, attempt, payload: { sharedStateUpdate, request } } = message;
      if (to === me || (to === 'all' && from !== me)) {
        console.log('received data track message', message);
        // receive updates
        if (sharedStateUpdate) {
          setSharedState((prev) => {
            const newState = { ...prev, ...sharedStateUpdate };
            console.log('updating state to', newState);
            return isEqual(prev, newState) ? prev : newState; // avoid equal-value rerendering
          });
        }
        // send updates when requested
        if (request === 'sharedState') {
          setSharedState((currentState) => {
            sendMessage({ to: from, payload: { sharedStateUpdate: currentState }, attempt });
            return currentState;
          });
        }
      }
    }

    room.on('trackMessage', syncSharedState);

    // when you enter the room, ask somebody there what the deal is
    let others = Array.from(room.participants.values())
      .filter((p) => p.state === 'connected')
      .filter((p) => p.identity !== me)
    if (others.length) {
      // they might not be listening yet, so keep asking until they respond
      let gotInfo = false, retries = 5, attempt = 1, intervalId = 0;
      let stop = () => { window.clearInterval(intervalId); gotInfo = true }
      room.once('trackMessage', stop);
      intervalId = window.setInterval(() => {
        others = others.filter((p) => p.state === 'connected');
        if (others.length === 0) { window.clearInterval(intervalId); return }
        const other = others[attempt % others.length];
        sendMessage({ to: other.identity, attempt, payload: { request: 'sharedState' } });
        if (++attempt > retries) window.clearInterval(intervalId);
      }, 500);
    }

    return () => {
      room.off('trackMessage', syncSharedState);
    }
  }, [room, sendMessage]);

  const changeState: StateChanger = useCallback((changes: RoomStateChange) => {
    setSharedState((prev) => {
      const newState = { ...prev, ...changes };
      return isEqual(prev, changes) ? prev : newState;
    });
    sendMessage({ to: 'all', payload: { sharedStateUpdate: changes }});
  }, [sendMessage, setSharedState, sendMessage]);

  // wire gain and delayTime to the audio streams
  useEffect(() => { setGain(sharedState.gain) },
    [sharedState.gain, setGain]);
  useEffect(() => { setDelayTime(sharedState.delayTime) },
    [sharedState.delayTime, setDelayTime]);

  // console.log('SharedRoomContext.Provider rerender');
  // reportEqual({ sharedState, changeState });
  const providerValue = prevIfEqual('SharedRoomContext.value', [sharedState, changeState]);

  return <SharedRoomContext.Provider value={providerValue as SharedRoomContextValue}>
    {children}
  </SharedRoomContext.Provider>
}

export const useSharedRoomState = () => useContext(SharedRoomContext);
