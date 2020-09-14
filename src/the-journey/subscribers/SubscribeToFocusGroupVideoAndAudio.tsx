import { useContext, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SharedRoomStateContext } from '../contexts/SharedRoomStateContext';

export default function SubscribeToFocusGroupVideoAndAudio() {
  const [{ room }, dispatch] = useAppContext();
  const [{ focusGroup }] = useContext(SharedRoomStateContext);

  useEffect(() =>
      dispatch('subscribe', { profile: 'focus', focus: focusGroup }),
    [room, focusGroup]);

  return null;
}
