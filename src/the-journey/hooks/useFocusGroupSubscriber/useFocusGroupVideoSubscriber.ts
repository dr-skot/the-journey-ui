import { useEffect } from 'react';
import useTrackSubscriber from '../useTrackSubscriber';
import useJourneyAppState from '../useJourneyAppState';

// updates track subscriptions when focus group changes

export default function useFocusGroupVideoSubscriber() {
  const { focusGroup } = useJourneyAppState();
  const subscribe = useTrackSubscriber();
  const subscribeProfile = focusGroup.length ? 'focus' : 'gallery';

  useEffect(() => {
    console.log('focus group changed: updating subscriptions');
    // TODO reorder these params
    subscribe(undefined, undefined, subscribeProfile, focusGroup);
  }, [focusGroup, subscribe, subscribeProfile]);
}
