import { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import useParticipants from '../../../hooks/useParticipants/useParticipants';

const MESSAGE_DELAY = 1500;

export default function useOperatorMessaging() {
  const [{ room, focusGroup, audioDelay }, dispatch] = useContext(AppContext);
  const participants = useParticipants();
  useEffect(() => { if (room) dispatch('publishDataTrack') }, [room, dispatch]);

  // sync data (that's not presently at default values) when new participants arrive
  // give them a couple of seconds to subscribe to the data channel
  useEffect(() => {
    let message = {};
    if (focusGroup.length) message = { ...message, focusGroup };
    if (audioDelay) message = { ...message, audioDelay };
    setTimeout(() => dispatch('broadcast', message), MESSAGE_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, dispatch]);
}

