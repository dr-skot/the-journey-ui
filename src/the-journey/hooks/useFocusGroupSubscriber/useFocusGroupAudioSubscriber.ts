import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

// TODO have focus group send better video
// updates track subscriptions when focus group changes

export default function useFocusGroupAudioSubscriber() {
  const [{ focusGroup }, dispatch] = useContext(AppContext);

  useEffect(() => {
    console.log('focus group changed: subscribing to listeen to', focusGroup);
    dispatch('subscribe', { profile: 'listen', focus: focusGroup,
      then: () => console.log('IT WORKED'),
      catch: (error: any) => console.log('IT DIDNT WORK', error)
    });
  }, [focusGroup, dispatch]);

}
