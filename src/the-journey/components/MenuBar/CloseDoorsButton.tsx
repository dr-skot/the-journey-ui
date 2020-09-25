import React from 'react';
import { Button } from '@material-ui/core';
import { useSharedRoomState } from '../../contexts/AppStateContext';
import { DateTime } from 'luxon';

export default function CloseDoorsButton() {
  const [{ doorsClosed }, roomStateDispatch] = useSharedRoomState();

  function toggleCloseDoors() {
    roomStateDispatch('set', {
      doorsClosed: doorsClosed === 'undefined' ? DateTime.local().toJSON() : 'undefined',
    });
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleCloseDoors}
      size="small" color="default" variant="contained">
      { doorsClosed === 'undefined' ? 'Close Doors' : 'Open Doors' }
    </Button>
  )
}
