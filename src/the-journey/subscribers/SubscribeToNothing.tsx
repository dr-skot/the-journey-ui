import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';

export default function SubscribeToNothing() {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() =>
      dispatch('subscribe', { profile: 'nothing' }),
    [room]);
  return null;
}
