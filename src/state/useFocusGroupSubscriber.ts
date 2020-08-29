import useDataTrackListener from './useDataTrackListener';
import { useEffect } from 'react';
import useSubscriber from '../hooks/useSubscriber/useSubscriber';

export default function useFocusGroupSubscriber() {
  const { focusGroup } = useDataTrackListener();
  const subscribe = useSubscriber();

  useEffect(() => {
    console.log('useFocusGroupSubscriber updating');
    // TODO reorder these params
    subscribe(undefined, undefined, 'listen', focusGroup)
      .then((result) => console.log('listen subscription succeeded', result))
      .catch((error) => console.log('listen subscription failed', error));
  }, [focusGroup]);

}
