import { useCallback, useState } from 'react';
import useTrackSubscriber, { SubscribeProfile } from './useTrackSubscriber';
import { useAppState } from '../../twilio/state';
import useVideoContext from './useVideoContext';
import useRoomState from '../../twilio/hooks/useRoomState/useRoomState';
import { isEqual } from 'lodash';

export type JoinStatus = 'ready' | 'joining' | 'joined';

export default function useRoomJoiner() {
  const { getToken } = useAppState();
  const { connect } = useVideoContext();
  const subscribe = useTrackSubscriber();

  const roomState = useRoomState();
  const [isJoining, setIsJoining] = useState(false);

  const joinStatus = roomState === 'connected'
    ? 'joined' : isJoining ? 'joining' : 'ready';

  const [prevResult, setPrevResult] = useState<any>({});

  const join = useCallback((roomName, identity, subscribeProfile: SubscribeProfile = 'data-only') => {
    console.log('joining room', roomName, { identity, subscribeProfile });
    setIsJoining(true);
    return getToken;
    /*
    return getToken(identity, roomName).then(token => connect(token))
`      .then(newRoom => {
        subscribe(roomName, identity, subscribeProfile);
        setIsJoining(false);
        console.log('joined', newRoom.state);
        return newRoom;
      });
     */
  }, [connect, getToken, subscribe, setIsJoining]);

  // tryng very hard to only return new data when something really changes
  // shouldn't react give this for free??
  let result = { join, joinStatus }
  if (isEqual(prevResult, result)) return prevResult;
  console.log('not isEqual', prevResult, result);
  setPrevResult(result);
  return result;
}
