import { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';

const MESSAGE_DELAY = 1500;

export default function useOperatorMessaging() {
  const [{ room, focusGroup, audioDelay, participants, starIdentity },
    dispatch] = useContext(AppContext);
  useEffect(() => { if (room) dispatch('publishDataTrack') }, [room, dispatch]);

  // sync data (that's not presently at default values) when new participants arrive
  // give them a couple of seconds to subscribe to the data channel
  useEffect(() => {
    let message = {};
    if (focusGroup.length) message = { ...message, focusGroup };
    if (audioDelay) message = { ...message, audioDelay };
    if (starIdentity) message = { ...message, starIdentity };
    setTimeout(() => dispatch('broadcast', message), MESSAGE_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, dispatch, starIdentity]);
}

