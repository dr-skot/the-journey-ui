import { useEffect } from 'react';
import useTrackSubscriber from '../useTrackSubscriber';
import useJourneyAppState from '../useJourneyAppState';

// updates track subscriptions when focus group changes

export default function useFocusGroupVideoSubscriber() {
  const { focusGroup } = useJourneyAppState();
  const subscribe = useTrackSubscriber();

  useEffect(() => {
    console.log('focus group changed: updating subscriptions');
    // TODO reorder these params
    // TODO have subscribe do its own logging
    subscribe(undefined, undefined, 'focus', focusGroup)
      .then((result) => console.log('focus subscription succeeded', result))
      .catch((error) => console.log('focus subscription failed', error));
  }, [focusGroup]);

}
