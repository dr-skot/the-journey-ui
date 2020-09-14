import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../contexts/AppContext';
import { inGroup, isRole } from '../../../utils/twilio';
import { Participant, RemoteAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import { SharedRoomContext } from '../../../contexts/SharedRoomContext';
import useRemoteTracks from '../../../hooks/useRemoteTracks';
import VerifiedIcon from '@material-ui/icons/CheckCircle';
import { toggleMembership } from '../../../utils/functional';

interface FOHControlsProps {
  participant: Participant;
}

export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }, dispatch] = useContext(AppContext);
  const [{ admitted, rejected }, changeSharedState] =  useContext(SharedRoomContext);
  const audioTracks = useRemoteTracks('audio');
  if (!isRole('foh')(room?.localParticipant) || isRole('foh')(participant)) return null;

  const audioTrack = audioTracks[participant.identity]?.[0] as RemoteAudioTrack;

  const toggleMute = () => dispatch('subscribe', {
    profile: 'gallery', focus: audioTrack ? [] : [participant.identity]});

  const reject = () =>
    changeSharedState({ rejected: [...rejected, participant.identity] });

  const toggleApproved = () =>
    changeSharedState({ admitted: toggleMembership(admitted || [])(participant.identity) });

  const approved = inGroup(admitted)(participant);

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      <span onClick={toggleMute}><AudioLevelIndicator audioTrack={audioTrack} background="white" /></span>
    </div>
    <div style={{ opacity: '90%' }}>
      <div style={{ float: 'right' }}>
        <Button
          onClick={toggleApproved}
          size="small" variant="contained"
          style={approved ? { color: 'white', background: 'green' } : {}}
          endIcon={approved ? <VerifiedIcon style={{ color: 'white', border: 'none' }}/> : null}
        >
          { approved ? 'Approved' : 'Approve' }
        </Button>
      </div>
      <div>
        <Button
          onClick={reject}
          size="small" color="secondary" variant="contained">
          Reject
        </Button>
      </div>
    </div>
      </>
  )
}
