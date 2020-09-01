// TODO where should this live?
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export default function useOperatorMessaging() {
  const [{ room, focusGroup, audioDelay, participants }, dispatch] = useContext(AppContext);
  useEffect(() => { if (room) dispatch('publishDataTrack') }, [room, dispatch]);

  // TODO where should this live?
  // sync data (that's not presently at default values) when new participants arrive
  // give them a couple of seconds to subscribe to the data channel
  useEffect(() => {
    if (focusGroup.length) setTimeout(() => dispatch('broadcast', { focusGroup }), 2000);
    if (audioDelay) setTimeout(() => dispatch('broadcast', { audioDelay }), 2000);
  }, [participants, dispatch]);
}

