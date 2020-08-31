import React, { useContext } from 'react';
import { LocalAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import { AppContext } from '../../../../contexts/AppContext';

export default function LocalAudioLevelIndicator() {
  const [{ localTracks }] = useContext(AppContext);
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  return <AudioLevelIndicator size={30} audioTrack={audioTrack} />;
}
