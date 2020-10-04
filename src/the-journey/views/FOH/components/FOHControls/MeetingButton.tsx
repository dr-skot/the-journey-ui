import { Participant } from 'twilio-video';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import { useAppState } from '../../../../contexts/AppStateContext';
import useMeeting from '../../../../hooks/useMeeting';
import { inGroup } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';
import React from 'react';

export default function MeetingButton({ participant } : { participant: Participant }) {
  const [{ room }] = useTwilioRoomContext();
  const [{ helpNeeded, meetable }, roomStateDispatch] =  useAppState();
  const { meeting } = useMeeting();

  if (!room) return null;
  if (!inGroup(meetable)(participant)) return null;

  const foh = room.localParticipant;
  const needsHelp = inGroup(helpNeeded)(participant);

  const toggleMeeting = () => {
    roomStateDispatch(meeting ? 'endMeeting' : 'startMeeting',
      { meeting: [participant.identity, foh.identity] });
    if (needsHelp) { // enda help call on meeting start
      roomStateDispatch('toggleMembership', { group: 'helpNeeded', identity: participant.identity });
    }
  }

  return <Button onClick={toggleMeeting}
                 size="small" color={needsHelp ? 'primary' : 'default'} variant="contained">
    { needsHelp ? 'help!' : `${meeting ? 'end' : 'start'} meeting` }
  </Button>;
}
