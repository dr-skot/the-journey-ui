import React from 'react';
import { useAppState } from '../../state';
import { LocalTrackPublication, RemoteTrackPublication } from 'twilio-video';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import DelayedAudioTrack from '../../the-journey/old/AudioTrack/DelayedAudioTrack';

interface DelayedAudioPublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
}

export default function DelayedAudioPublication({ publication }: DelayedAudioPublicationProps) {
  const { audioContext } = useAppState();
  // TODO figure out why useTrack is returning null
  const track = useTrack(publication);

  console.log('DelayedAudioPublication', track, publication);
  if (!track) return null;

  // @ts-ignore
  return audioContext ? <DelayedAudioTrack track={track} /> : <AudioTrack track={track} />;
}
