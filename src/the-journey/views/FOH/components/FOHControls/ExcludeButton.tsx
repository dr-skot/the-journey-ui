import { Participant } from 'twilio-video';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import { useAppState } from '../../../../contexts/AppStateContext';
import { removeParticipant } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';
import React from 'react';

export default function ExcludeButton({ participant }: { participant: Participant }) {
  const [{ excluded }, appStateDispatch] =  useAppState();

  const toggleExcluded = () => {
    appStateDispatch('toggleMembership',
      { group: 'excluded', identity: participant.identity });
  }

  return <Button
    onClick={toggleExcluded}
    size="small" color="default" variant="contained">
    { excluded?.includes(participant.identity) ? 'include' : 'exclude' }
  </Button>
}
