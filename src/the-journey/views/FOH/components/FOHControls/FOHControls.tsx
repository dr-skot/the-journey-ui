import React from 'react';
import { Participant } from 'twilio-video';
import { isRole } from '../../../../utils/twilio';
import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import CameraMicButton from './CameraMicButton';
import MeetingButton from './MeetingButton';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';
import useParticipantNetworkQualityLevel
  from '../../../../../twilio/hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import NetworkQualityLevel from '../../../../../twilio/components/NetworkQualityLevel/NetworkQualityLevel';

interface FOHControlsProps {
  participant: Participant;
}

export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }] = useTwilioRoomContext();
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  console.log('networkQualityLevel', { networkQualityLevel });

  if (!room) return null;
  if (!isRole('foh')(room.localParticipant) || isRole('foh')(participant)) return null;

  return  (
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <NetworkQualityLevel qualityLevel={networkQualityLevel} />
      </div>
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

