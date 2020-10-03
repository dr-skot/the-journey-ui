import React from 'react';
import { Button } from '@material-ui/core';
import { useAppState } from '../../contexts/AppStateContext';

export default function MuteAllButton() {
  const [{ muteAll }, roomStateDispatch] = useAppState();

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
