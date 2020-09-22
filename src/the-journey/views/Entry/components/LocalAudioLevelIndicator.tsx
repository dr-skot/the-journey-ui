import React, { useContext } from 'react';
import { LocalAudioTrack, LocalTrack } from 'twilio-video';
import { useAppContext } from '../../../contexts/AppContext';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';

export default function LocalAudioLevelIndicator() {
  const [{ localTracks }] = useAppContext();
  const audioTrack = localTracks.find((track: LocalTrack) => track.kind === 'audio') as LocalAudioTrack;

  return <AudioLevelIndicator size={30} audioTrack={audioTrack} background={'white'} />;
}
