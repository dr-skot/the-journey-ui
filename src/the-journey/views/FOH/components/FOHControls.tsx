import React from 'react';
import { isEqual } from 'lodash';
import { Button } from '@material-ui/core';
import VerifiedIcon from '@material-ui/icons/CheckCircle';
import { toggleMembership } from '../../../utils/functional';
import { Participant, RemoteAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import { inGroup, isRole } from '../../../utils/twilio';
import { useAppContext } from '../../../contexts/AppContext';
import { useSharedRoomState } from '../../../contexts/SharedRoomContext';
import useRemoteTracks from '../../../hooks/useRemoteTracks';

interface FOHControlsProps {
  participant: Participant;
}

export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }, dispatch] = useAppContext();
  const [{ admitted, rejected, meetups }, changeSharedState] =  useSharedRoomState();
  const audioTracks = useRemoteTracks('audio');
  if (!isRole('foh')(room?.localParticipant) || isRole('foh')(participant)) return null;

  const fohIdentity = room?.localParticipant.identity || '';
  const { identity } = participant;

  const inMeeting = meetups.some((group) => isEqual(group, [identity, fohIdentity]));

  const audioTrack = audioTracks[identity]?.[0] as RemoteAudioTrack;

  const toggleMute = () => dispatch('subscribe', {
    profile: 'gallery', focus: audioTrack ? [] : [identity]});

  const reject = () =>
    changeSharedState({ rejected: [...rejected, identity] });

  const toggleApproved = () =>
    changeSharedState({ admitted: toggleMembership(admitted || [])(identity) });

  const toggleMeeting = () => {
    changeSharedState({ meetups: toggleMembership(meetups)([identity, fohIdentity]) });
  };

  const approved = inGroup(admitted)(participant);

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      <span onClick={toggleMute}><AudioLevelIndicator audioTrack={audioTrack} background="white" /></span>
    </div>
      <div style={{ width: '100%', textAlign: 'right' }}>
        <Button onClick={toggleMeeting}>{`${inMeeting ? 'end' : 'start'} meeting`}</Button>
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
