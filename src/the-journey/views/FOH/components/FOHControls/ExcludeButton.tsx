import { Participant } from 'twilio-video';
import { useAppState } from '../../../../contexts/AppStateContext';
import { Button } from '@material-ui/core';
import React from 'react';

export default function ExcludeButton({ participant }: { participant: Participant }) {
  const [{ excluded }, appStateDispatch] =  useAppState();

  const toggleExcluded = () => {
    appStateDispatch('toggleMembership',
      { group: 'excluded', identity: participant.identity });
  }

  const isExcluded = excluded.includes(participant.identity);

  return <Button
    onClick={toggleExcluded}
    size="small" color={ isExcluded ? 'secondary' : 'default' } variant="contained">
    { isExcluded ? 'hidden!' : 'hide' }
  </Button>
}
