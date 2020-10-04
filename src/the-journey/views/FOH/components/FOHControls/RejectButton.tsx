import { Participant } from 'twilio-video';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import { useAppState } from '../../../../contexts/AppStateContext';
import { removeParticipant } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';
import React from 'react';

export default function RejectButton({ participant }: { participant: Participant }) {
  const [{ room }] = useTwilioRoomContext();
  const [, appStateDispatch] =  useAppState();

  const reject = () => {
    appStateDispatch('toggleMembership',
      { group: 'rejected', identity: participant.identity });
    // give user 1/10 sec to redirect to rejection page before kicking them out of Twilio room
    setTimeout(() => {
      removeParticipant(participant, room).then(() => {
        appStateDispatch('leaveRoom', { identity: participant.identity });
      })
    }, 100);
  }

  return <Button
    onClick={reject}
    size="small" color="secondary" variant="contained">
    Reject
  </Button>
}

