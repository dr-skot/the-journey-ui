import { useCallback } from 'react';
import useVideoContext from './useVideoContext';

const TIMEOUT_DELAY = 5000;

export type SubscribeProfile = 'data-only' | 'listen' | 'audio' | 'focus' | 'gallery' | 'listen' | 'none'

export default function useTrackSubscriber() {
  const { room: currentRoom } = useVideoContext();

  const subscribe = useCallback(
    (room: string = currentRoom.name, participantId: string = currentRoom.localParticipant.identity,
     policy: string = 'data_only', focus: string[] = []) => {
      const headers = new window.Headers();
      const endpoint = process.env.REACT_APP_SUBSCRIBE_ENDPOINT || '/subscribe';

      const uri = encodeURIComponent;

      const params = `${uri(room)}/${uri(participantId)}/${uri(policy)}?focus=${focus.map(uri).join(',')}`;
      const url = `${endpoint}/${params}`

      console.log(`fetching ${url}`);

      const timeoutId = setTimeout(
        () => console.log(`fetch ${url} no answer after ${TIMEOUT_DELAY}ms`)
        , TIMEOUT_DELAY
      );

      return fetch(url, { headers })
        .then(res => console.log(`${policy} subscribe successful, result`, res))
        .catch(error => console.log(`error subscribing to ${policy}:`, error))
        .finally(() => clearTimeout(timeoutId));
    }, [currentRoom]);

  return subscribe;
}
