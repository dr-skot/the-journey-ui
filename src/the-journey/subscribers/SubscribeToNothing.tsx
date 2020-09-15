import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';

export default function SubscribeToNothing() {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() => {
    if (room) dispatch('subscribe', { profile: 'nothing' })
    }, [room, dispatch]);
  return null;
}
