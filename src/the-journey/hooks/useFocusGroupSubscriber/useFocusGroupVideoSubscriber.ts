import { useContext, useEffect } from 'react';
import useTrackSubscriber from '../useTrackSubscriber';
import useJourneyAppState from '../useJourneyAppState';
import { AppContext } from '../../contexts/AppContext';

// updates track subscriptions when focus group changes

export default function useFocusGroupVideoSubscriber() {
  const [{ focusGroup }, dispatch] = useContext(AppContext);

  useEffect(() => {
    console.log('focus group changed: updating subscriptions');
    dispatch('subscribe', {
      profile: focusGroup.length ? 'focus' : 'gallery',
      focus: focusGroup
    });
  }, [focusGroup, dispatch]);
}
