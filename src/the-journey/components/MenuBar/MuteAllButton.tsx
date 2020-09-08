import React, { useCallback, useContext } from 'react';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { getIdentities, isRole } from '../../utils/twilio';
import { Button } from '@material-ui/core';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';

export default function MuteAllButton() {
  const { muteAll, setMuteAll } = useContext(AudioStreamContext);

  function toggleMuteAll() { setMuteAll((whatItWas) => !whatItWas) }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={toggleMuteAll}
      size="small" color="primary" variant="contained">
      { muteAll ? 'Unmute' : 'Mute All' }
    </Button>
  )
}
