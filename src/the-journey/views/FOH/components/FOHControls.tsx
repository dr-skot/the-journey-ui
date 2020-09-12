import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../contexts/AppContext';
import { inGroup, isRole } from '../../../utils/twilio';
import { Participant } from 'twilio-video';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import { toggleMembership } from '../../../utils/functional';
import { SharedRoomContext } from '../../../contexts/SharedRoomContext';

interface FOHControlsProps {
  participant: Participant;
}

// TODO deal with all this @ts-ignore, and maybe SharedRoomContext needs a reducer
export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }] = useContext(AppContext);
  const  [{ admitted, rejected, mutedInLobby }, changeSharedState] =  useContext(SharedRoomContext)
  if (!isRole('foh')(room?.localParticipant) || isRole('foh')(participant)) return null;

  const audioTrack = inGroup(mutedInLobby)(participant)
    ? null
    : participant.audioTracks.values().next().value?.track;

  const toggleMute = () =>
    // @ts-ignore
    changeSharedState({ mutedInLobby: toggleMembership(mutedInLobby)(participant.identity) });

  const reject = () =>
    // @ts-ignore
    changeSharedState({ rejected: [...rejected, participant.identity] });

  const admit = () =>
    // @ts-ignore
    changeSharedState({ admitted: [...(admitted || []), participant.identity] });

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      <span onClick={toggleMute}><AudioLevelIndicator audioTrack={audioTrack} background="white" /></span>
    </div>
    <div style={{ opacity: '90%' }}>
      <div style={{ float: 'right' }}>
        <Button
          onClick={reject}
          size="small" color="secondary" variant="contained">
          Reject
        </Button>
      </div>
      <div>
        <Button
          onClick={admit}
          size="small" color="default" variant="contained">
          Admit
        </Button>
      </div>
    </div>
      </>
  )
}
