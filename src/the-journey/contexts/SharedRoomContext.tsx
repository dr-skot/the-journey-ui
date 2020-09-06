import React, { useCallback, useRef, useState } from 'react';
import { createContext, ReactNode, useEffect } from 'react';
import { Participant, Room } from 'twilio-video';
import { getLocalDataTrack } from '../utils/twilio';
import { pick, tryToParse } from '../utils/functional';
import { isEqual, isEmpty, uniq } from 'lodash';
import { DEFAULT_DELAY, DEFAULT_GAIN } from './AudioStreamContext/AudioStreamContext';

type Identity = Participant.Identity;

interface SharedRoomState {
  admitted?: Identity[],
  rejected?: Identity[],
  mutedInLobby?: Identity[],
  focusGroup?: Identity[],
  gain?: number,
  delayTime?: number,
}

type StateChanger = (changes: SharedRoomState) => void;

const initialState = {
  admitted: [],
  rejected: [],
  mutedInLobby: [],
  focusGroup: [],
  gain: DEFAULT_GAIN,
  delayTime: DEFAULT_DELAY,
} as SharedRoomState;

const initialStateChanger: StateChanger = () => {};


const SharedRoomContext = createContext([initialState, initialStateChanger]);

interface QueuedMessage {
  to: Identity | 'all',
  payload: { request: 'sharedState' } | { sharedStateUpdate: SharedRoomState },
}

interface ProviderProps {
  children: ReactNode,
  room?: Room,
}

export default function SharedRoomContextProvider({ room, children }: ProviderProps) {
  const [queue, setQueue] = useState<QueuedMessage[]>([]);
  const [sharedState, setSharedState] = useState<SharedRoomState>(initialState);
  const myProps = useRef<string[]>([]);

  // queue messages
  const sendMessage = useCallback((message: QueuedMessage) => {
    setQueue((prev) => [...prev, message]);
  }, [setQueue]);

  // return-address and send queued messages when we have a data track
  useEffect(() => {
    if (!room) return;
    const me = room.localParticipant.identity;
    getLocalDataTrack(room).then((track) => {
      queue.forEach((message) => {
        track.send(JSON.stringify({ ...message, from: me }));
      });
    });
  }, [room, queue])

  // listen for shared state updates, then request an update
  useEffect(() => {
    if (!room) return;
    const me = room.localParticipant.identity;

    function syncSharedState(data: string) {
      const message = tryToParse(data) || {};
      const { from, to, payload: { sharedStateUpdate, request } } = message;
      if (to === me || (to === 'all' && from !== me)) {
        // receive updates
        if (sharedStateUpdate) {
          setSharedState((prev) => {
            const newState = { ...prev, ...sharedStateUpdate };
            return isEqual(prev, newState) ? prev : newState; // avoid equal-value rerendering
          });
        }
        // send updates when requested
        if (request === 'sharedState') {
          setSharedState((currentState) => {
            const myState = pick(myProps.current, currentState);
            if (!isEmpty(myState)) sendMessage({ to: from, payload: { sharedStateUpdate: myState } });
            return currentState;
          });
        }

      }
    }

    room.on('trackMessage', syncSharedState);
    sendMessage({ to: 'all', payload: { request: 'sharedState' } })

    return () => {
      room.off('trackMessage', syncSharedState);
    }
  }, [room]);

  // you become custodian of any state data that you change explicitly (ie not via updates)
  const changeState: StateChanger = useCallback((changes) => {
    myProps.current = uniq([...myProps.current, ...Object.keys(changes)]);
    // @ts-ignore
    setSharedState((prev) => {
      const newState = { ...prev, ...changes };
      return isEqual(prev, changes) ? prev : newState;
    });
    sendMessage({ to: 'all', payload: { sharedStateUpdate: changes }});
  }, []);

  return <SharedRoomContext.Provider value={[sharedState, changeState]}>
    {children}
  </SharedRoomContext.Provider>
}
