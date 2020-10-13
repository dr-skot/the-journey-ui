import { serverNow } from '../utils/ServerDate';
import { useEffect, useState } from 'react';

export default function useClock(interval: number) {
  const [time, setTime] = useState(serverNow());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(serverNow());
    }, interval);
    return () => window.clearInterval(intervalId);
  }, [interval])

  return time;
}
