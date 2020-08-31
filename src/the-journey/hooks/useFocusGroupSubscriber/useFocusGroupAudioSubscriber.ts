import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

// TODO have focus group send better video
// updates track subscriptions when focus group changes

export default function useFocusGroupAudioSubscriber() {
  const [{ focusGroup }, dispatch] = useContext(AppContext);

  useEffect(() => {
    console.log('focus group changed: updating subscriptions');
    dispatch('subscribe', { profile: 'listen', focus: focusGroup });
  }, [focusGroup, dispatch]);

}
