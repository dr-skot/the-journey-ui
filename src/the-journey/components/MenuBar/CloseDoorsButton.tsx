import React from 'react';
import { Button } from '@material-ui/core';
import { useAppState } from '../../contexts/AppStateContext';
import { serverNow } from '../../utils/ServerDate';
import { DEFAULT_DOOR_POLICY } from '../../utils/foh';
import useShowtime from '../../hooks/useShowtime/useShowtime';

export default function CloseDoorsButton() {
  const [, roomStateDispatch] = useAppState();
  const showtime = useShowtime()
  const now = serverNow();

  if (!showtime) return null;
  const { curtain, close } = showtime;

  const wayTooLate = curtain.plus({ minutes: DEFAULT_DOOR_POLICY.close });
  if (now > wayTooLate) return null;

  function toggleCloseDoors() {
    roomStateDispatch('set', {
      doorsClosed: now < close ? serverNow().toJSON() : 'undefined',
    });
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleCloseDoors}
      size="small" color="default" variant="contained">
      { now < close ? 'Close Doors' : 'Open Doors' }
    </Button>
  );
}
