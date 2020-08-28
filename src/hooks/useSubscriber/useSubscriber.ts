import { useCallback } from 'react';

export default function useSubscriber() {
  const subscribe = useCallback(
    (room: string, participantId: string, policy: string = 'data_only', focus: string[] = []) => {
      const headers = new window.Headers();
      const endpoint = process.env.REACT_APP_SUBSCRIBE_ENDPOINT || '/subscribe';

      const uri = encodeURIComponent;

      const params = `/${uri(room)}/${uri(participantId)}/${uri(policy)}?focus=${focus.map(uri).join(',')}`;
      console.log(`${endpoint}/${params}`);

      return fetch(`${endpoint}/${params}`, { headers }).then(res => res.text());
    }, []);

  return subscribe;
}
