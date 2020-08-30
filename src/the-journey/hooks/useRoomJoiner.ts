import { useCallback } from 'react';
import useTrackSubscriber, { SubscribeProfile } from './useTrackSubscriber';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function useRoomJoiner() {
  const { getToken } = useAppState();
  const { connect } = useVideoContext();
  const subscribe = useTrackSubscriber();

  const join = useCallback((roomName, identity, subscribeProfile: SubscribeProfile = 'data-only') => {
    console.log('joining room', roomName, { identity, subscribeProfile });
    return getToken(identity, roomName).then(token => connect(token))
      .then(newRoom => {
        subscribe(roomName, identity, subscribeProfile);
        return newRoom;
      });
  }, [connect, getToken, subscribe]);

  return join;
}
