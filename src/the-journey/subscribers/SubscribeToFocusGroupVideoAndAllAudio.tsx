import { useContext, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SharedRoomContext } from '../contexts/SharedRoomContext';

export default function SubscribeToFocusGroupVideoAndAllAudio() {
  const [{ room }, dispatch] = useAppContext();
  const [{ focusGroup }] = useContext(SharedRoomContext);

  useEffect(() =>
      dispatch('subscribe', { profile: 'focus-safer', focus: focusGroup }),
    [room, focusGroup]);

  return null;
}
