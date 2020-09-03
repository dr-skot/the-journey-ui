import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../contexts/AppContext';
import { isRole } from '../../../utils/twilio';
import { Participant } from 'twilio-video';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';

interface FOHControlsProps {
  participant: Participant;
}
export default function FOHControls({ participant }: FOHControlsProps) {
  const  [{ room, mutedInLobby }, dispatch] =  useContext(AppContext)
  if (!isRole('foh')(room?.localParticipant) || isRole('foh')(participant)) return null;

  const audioTrack = mutedInLobby.includes(participant.identity)
    ? null
    : participant.audioTracks.values().next().value?.track;

  function toggleMute() {
    dispatch('toggleMute', { identity: participant.identity });
  }

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      <span onClick={toggleMute}><AudioLevelIndicator audioTrack={audioTrack} background="white" /></span>
    </div>
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
      </>
  )
}
