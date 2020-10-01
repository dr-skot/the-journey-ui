import useShowtime from '../../../hooks/useShowtime';
import React from 'react';
import { Redirect } from 'react-router-dom';

export default function NewEntry() {
  /*
  const showtime = useShowtime();
  if (!showtime) return userMessage(INVALID_CODE);
  if (!showtime.canEnter) return userMessage(WRONG_TIME, showtime); // TODO rename canEnter wrong time
  if (noOperatorInRoom(roomName)) return userMessage(EMPTY_THEATER);
  sessionStorage.setItem('entry', JSON.stringify(showtime.code));

   */
  return <Redirect push to="/name"/>
}
