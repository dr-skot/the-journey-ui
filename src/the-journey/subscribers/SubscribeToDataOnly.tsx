import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';

export default function SubscribeToDataOnly() {
  const [{ room }, dispatch] = useAppContext();

  // TODO don't bother (in all subscribers) if room is undefined
  useEffect(() =>
      dispatch('subscribe', { profile: 'data-only' }),
    [room]);
  return null;
}
