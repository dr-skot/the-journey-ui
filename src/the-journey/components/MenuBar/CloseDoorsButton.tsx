import React from 'react';
import { Button } from '@material-ui/core';
import { useSharedRoomState } from '../../contexts/AppStateContext';
import { serverNow } from '../../utils/ServerDate';

export default function CloseDoorsButton() {
  const [{ doorsClosed }, roomStateDispatch] = useSharedRoomState();

  function toggleCloseDoors() {
    roomStateDispatch('set', {
      doorsClosed: doorsClosed === 'undefined' ? serverNow().toJSON() : 'undefined',
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
