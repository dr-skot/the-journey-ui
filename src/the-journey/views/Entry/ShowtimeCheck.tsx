import React from 'react';
import Entry from './Entry';
import { Messages } from '../../messaging/messages';
import useShowtime from '../../hooks/useShowtime';

export default function ShowtimeCheck() {
  const showtime = useShowtime();

  if (!showtime) return Messages.INVALID_CODE;
  if (!showtime.canEnter) return Messages.WRONG_TIME(showtime);

  return <Entry/>;
}
