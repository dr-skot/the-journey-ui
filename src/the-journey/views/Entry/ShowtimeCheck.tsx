import React from 'react';
import Entry from './Entry';
import { Messages } from '../../messaging/messages';
import useShowtime from '../../hooks/useShowtime/useShowtime';
import { canEnter } from '../../utils/foh';

export default function ShowtimeCheck() {
  const showtime = useShowtime();
  if (!showtime) return Messages.INVALID_CODE;
  if (!canEnter(showtime)) return Messages.WRONG_TIME(showtime);

  return <Entry/>;
}
