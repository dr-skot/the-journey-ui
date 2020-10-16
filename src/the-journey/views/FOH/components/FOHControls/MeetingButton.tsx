import { Participant } from 'twilio-video';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import { useAppState } from '../../../../contexts/AppStateContext';
import useMeeting from '../../../../hooks/useMeeting';
import { inGroup, inGroups } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';
import React from 'react';

export default function MeetingButton({ participant } : { participant: Participant }) {
  const [{ room }] = useTwilioRoomContext();
  const [{ helpNeeded, notReady, meetings }, roomStateDispatch] =  useAppState();
  const { meeting } = useMeeting();

  if (!room) return null;
  const arriving = inGroup(notReady)(participant);
  const meetingWithSomeoneElse = !meeting && inGroups(meetings)(participant);

  const foh = room.localParticipant;
  const needsHelp = inGroup(helpNeeded)(participant);

  const toggleMeeting = () => {
    roomStateDispatch(meeting ? 'endMeeting' : 'startMeeting',
      { meeting: [participant.identity, foh.identity] });
    if (needsHelp) { // enda help call on meeting start
      roomStateDispatch('toggleMembership', { group: 'helpNeeded', identity: participant.identity });
    }
  }

  return <Button onClick={toggleMeeting} disabled={arriving || meetingWithSomeoneElse}
                 size="small" color={needsHelp ? 'primary' : 'default'} variant="contained">
    { arriving
      ? 'in lobby'
      : meetingWithSomeoneElse
        ? 'in meeting'
        : meeting
          ? 'end meeting'
          : needsHelp
            ? 'help!'
            : 'start meeting' }
  </Button>;
}
