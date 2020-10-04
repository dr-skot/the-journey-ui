import { Participant } from 'twilio-video';
import { useAppState } from '../../../../contexts/AppStateContext';
import { inGroup } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';
import VerifiedIcon from '@material-ui/icons/CheckCircle';
import React from 'react';

export default function ApproveButton({ participant } : { participant: Participant}) {
  const [{ admitted }, roomStateDispatch] =  useAppState();
  const approved = inGroup(admitted)(participant);

  const toggleApproved = () => {
    roomStateDispatch('toggleMembership',
      { group: 'admitted', identity: participant.identity });
  }

  return <Button
    onClick={toggleApproved}
    style={approved ? { color: 'white', background: 'green' } : {}}
    endIcon={approved ? <VerifiedIcon style={{ color: 'white', border: 'none' }}/> : null}
    size="small" variant="contained">
    { approved ? 'Approved' : 'Approve' }
  </Button>

}
