import React from 'react';
import { LocalTrackPublication, RemoteTrackPublication } from 'twilio-video';
import useTrack from '../../twilio/hooks/useTrack/useTrack';
import AudioElement from '../components/audio/AudioElement';
import DelayedAudioTrack from './AudioTrack/DelayedAudioTrack';
import useJourneyAppState from '../hooks/useJourneyAppState';

interface DelayedAudioPublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
}

export default function DelayedAudioPublication({ publication }: DelayedAudioPublicationProps) {
  const { audioContext } = useJourneyAppState();
  // TODO figure out why useTrack is returning null
  const track = useTrack(publication);

  console.log('DelayedAudioPublication', track, publication);
  if (!track) return null;

  // @ts-ignore
  return audioContext ? <DelayedAudioTrack track={track} /> : <AudioElement track={track} />;
}
