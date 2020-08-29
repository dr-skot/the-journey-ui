import { useEffect } from 'react';
import useTrackSubscriber from '../useTrackSubscriber';
import useJourneyAppState from '../useJourneyAppState';

// TODO have focus group send better video
// updates track subscriptions when focus group changes

export default function useFocusGroupAudioSubscriber() {
  const { focusGroup } = useJourneyAppState();
  const subscribe = useTrackSubscriber();

  useEffect(() => {
    console.log('focus group changed: updating subscriptions');
    // TODO reorder these params
    subscribe(undefined, undefined, 'listen', focusGroup)
      .then((result) => console.log('listen subscription succeeded', result))
      .catch((error) => console.log('listen subscription failed', error));
  }, [focusGroup]);

}
