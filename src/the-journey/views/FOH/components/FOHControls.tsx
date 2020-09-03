import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../contexts/AppContext';
import { isRole } from '../../../utils/twilio';
import { Participant } from 'twilio-video';

interface FOHControlsProps {
  participant: Participant;
}
export default function FOHControls({ participant }: FOHControlsProps) {
  const  [{ room }, dispatch] =  useContext(AppContext)
  if (!isRole('foh')(room?.localParticipant) || isRole('foh')(participant)) return null;

  return  (
    <div style={{ opacity: '90%' }}>
      <div style={{ float: 'right' }}>
        <Button
          onClick={() => dispatch('reject', { identities: [participant.identity]})}
          size="small" color="secondary" variant="contained">
          Reject
        </Button>
      </div>
      <div>
        <Button
          onClick={() => dispatch('admit', { identities: [participant.identity]})}
          size="small" color="default" variant="contained">
          Admit
        </Button>
      </div>
    </div>
  )
}
