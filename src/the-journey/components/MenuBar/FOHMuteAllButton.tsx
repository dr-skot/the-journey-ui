import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';

export default function MuteAllButton() {
  const  [{ admitted, rejected, mutedInLobby }, changeSharedState] =  useContext(SharedRoomContext);

  const toggleMuteAll = () => {
    if (mutedInLobby.length) changeSharedState({ mutedInLobby: [] })
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleMuteAll}
      size="small" color="default" variant="contained">
      { mutedInLobby.length ? 'Mute All' : 'Unmute All' }
    </Button>
  )
}
