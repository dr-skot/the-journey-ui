import { useContext, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SharedRoomContext } from '../contexts/SharedRoomContext';

export default function SubscribeToFocusGroupAudio() {
  const [{ room }, dispatch] = useAppContext();
  const [{ focusGroup }] = useContext(SharedRoomContext);

  useEffect(() => {
      if (room) dispatch('subscribe', { profile: 'listen', focus: focusGroup });
    },[room, focusGroup, dispatch]);

  return null;
}
