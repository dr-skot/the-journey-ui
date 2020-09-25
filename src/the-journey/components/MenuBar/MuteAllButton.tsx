import React from 'react';
import { Button } from '@material-ui/core';
import { useSharedRoomState } from '../../contexts/AppStateContext';

export default function MuteAllButton() {
  const [{ muteAll }, roomStateDispatch] = useSharedRoomState();

  function toggleMuteAll() {
    roomStateDispatch('set', { muteAll: !muteAll });
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleMuteAll}
      size="small" color="default" variant="contained">
      { muteAll ? 'Unmute' : 'Mute All' }
    </Button>
  )
}
