import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';

export default function SubscribeToAllVideo() {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() =>
    dispatch('subscribe', { profile: 'gallery' }),
    [room]);
  return null;
}
