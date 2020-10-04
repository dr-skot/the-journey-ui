import { useTwilioRoomContext } from '../../../../contexts/TwilioRoomContext';
import React, { useState } from 'react';
import useRemoteTracks from '../../../../hooks/useRemoteTracks';
import { Participant, RemoteAudioTrack } from 'twilio-video';
import { subscribe } from '../../../../utils/twilio';
import { Button, CircularProgress } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/Videocam';
import CameraOffIcon from '@material-ui/icons/VideocamOff';
import AudioLevelIndicator from '../../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';

export default function CameraMicButton({ participant }: { participant: Participant }) {
  const [{ room }] = useTwilioRoomContext();
  const [waiting, setWaiting] = useState(false);
  const audioTracks = useRemoteTracks('audio');

  const audioTrack = audioTracks[participant.identity]?.[0] as RemoteAudioTrack;
  const spying = !!audioTrack;

  if (!room) return null;

  const toggleMute = () => {
    setWaiting(true);
    subscribe(
      room?.sid || '', room.localParticipant.sid,
      'spy', spying ? [] : [participant.identity]
    )
      .finally(() => setWaiting(false));
  }

  return waiting
    ? <CircularProgress size={20} />
    : (
      <Button onClick={toggleMute}>
        { spying ? <CameraIcon /> : <CameraOffIcon /> }
        <AudioLevelIndicator audioTrack={audioTrack} background={'white'} />
      </Button>
    );
}
