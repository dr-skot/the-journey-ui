import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export default function SubscribeToAllAudio() {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() =>
    dispatch('subscribe', { profile: 'audio' }),
    [room]);

  return null;
}
