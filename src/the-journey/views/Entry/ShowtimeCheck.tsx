import React from 'react';
import Entry from './Entry';
import { Messages } from '../../messaging/messages';
import useShowtime from '../../hooks/useShowtime';

export default function ShowtimeCheck() {
  // entry : validShow ? history push /name : gentleMessage
  // /name, verify has been to /entry: onSubmit history push /media
  // /medio, verify has name: onSubmit redirect to show

  // /show reload: join room, same identity
  // use back button for getMedia

  const showtime = useShowtime();
  if (!showtime) return Messages.INVALID_CODE;
  if (!showtime.canEnter) return Messages.WRONG_TIME(showtime);

  // TODO check for empty room here

  return <Entry/>;

}
