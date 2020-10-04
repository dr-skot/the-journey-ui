import React from 'react';
import { Button } from '@material-ui/core';
import { Participant } from 'twilio-video';
import { isRole, removeParticipant } from '../../../../utils/twilio';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import { useAppState } from '../../../../contexts/AppStateContext';
import CameraMicButton from './CameraMicButton';
import MeetingButton from './MeetingButton';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';

interface FOHControlsProps {
  participant: Participant;
}

export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }] = useTwilioRoomContext();

  if (!room) return null;
  if (!isRole('foh')(room.localParticipant)) return null;

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      <CameraMicButton participant={participant}/>
    </div>
      <div style={{ width: '100%', textAlign: 'right', opacity: '90%', marginBottom: 2 }}>
        <MeetingButton participant={participant}/>
      </div>
    <div style={{ opacity: '90%' }}>
      <div style={{ float: 'right' }}>
        <ApproveButton participant={participant}/>
      </div>
      <div>
        <RejectButton participant={participant}/>
      </div>
    </div>
      </>
  )
}

