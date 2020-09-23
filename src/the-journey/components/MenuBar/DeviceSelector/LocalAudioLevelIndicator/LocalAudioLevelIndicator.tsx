import React, { useContext } from 'react';
import { LocalAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import { TwilioRoomContext } from '../../../../contexts/TwilioRoomContext';

export default function LocalAudioLevelIndicator() {
  const [{ localTracks }] = useContext(TwilioRoomContext);
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  return <AudioLevelIndicator size={30} audioTrack={audioTrack} />;
}
