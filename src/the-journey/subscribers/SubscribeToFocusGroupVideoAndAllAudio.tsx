import { useContext, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SharedRoomContext } from '../contexts/SharedRoomContext';

export default function SubscribeToFocusGroupVideoAndAllAudio() {
  const [{ room }, dispatch] = useAppContext();
  const [{ focusGroup }] = useContext(SharedRoomContext);

  useEffect(() => {
    if (room) dispatch('subscribe', { profile: 'focus-safer', focus: focusGroup })
    }, [room, focusGroup, dispatch]);

  return null;
}
