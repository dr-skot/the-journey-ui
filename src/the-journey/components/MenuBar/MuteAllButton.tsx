import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';

export default function MuteAllButton() {
  const [{ muteAll }, setSharedState] = useSharedRoomState();

  function toggleMuteAll() {
    // @ts-ignore
    setSharedState({ muteAll: !muteAll });
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
