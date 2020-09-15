import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export default function SubscribeToAllAudio() {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() => {
      if (room) dispatch('subscribe', { profile: 'audio' });
    },[room, dispatch]);

  return null;
}
