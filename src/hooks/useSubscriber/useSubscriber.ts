import { useCallback } from 'react';

export default function useSubscriber() {
  const subscribe = useCallback(
    (room: string, participantId: string, policy: string = 'data_only', focus: string[] = []) => {
      const headers = new window.Headers();
      const endpoint = process.env.REACT_APP_SUBSCRIBE_ENDPOINT || '/subscribe';

      const uri = encodeURIComponent;

      const params = `${uri(room)}/${uri(participantId)}/${uri(policy)}?focus=${focus.map(uri).join(',')}`;
      const url = `${endpoint}/${params}`
      console.log(url);
      const delay = 5000;
      const timeoutId = setTimeout(() => console.log(`fetch ${url} no answer after ${delay}ms`), delay);

      return fetch(url, { headers })
        .then(res => console.log('fetch successful', res))
        .catch(error => console.log('error fetching', error))
        .finally(() => clearTimeout(timeoutId));
    }, []);

  return subscribe;
}
