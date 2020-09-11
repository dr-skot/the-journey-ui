import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';

export default function MuteAllButton() {
  const { muteAll, setMuteAll } = useContext(AudioStreamContext);

  function toggleMuteAll() { setMuteAll((whatItWas) => !whatItWas) }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleMuteAll}
      size="small" color="default" variant="contained">
      { muteAll ? 'Unmute' : 'Mute All' }
    </Button>
  )
}
