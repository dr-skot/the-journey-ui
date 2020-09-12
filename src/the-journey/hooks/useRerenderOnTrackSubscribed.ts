import { useAppContext } from '../contexts/AppContext';
import { useEffect, useState } from 'react';

export default function useRerenderOnTrackSubscribed() {
  const [{ room }] = useAppContext();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!room) return;
    const update = () => setToggle((prev) => !prev);
    room.on('trackSubscribed', update);
    return () => { room.off('trackSubscribed', update) }
  }, [room]);

  return toggle;
}
