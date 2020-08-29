import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useJourneyAppState from '../../hooks/useJourneyAppState';

// TODO support activeSinkId

interface DelayedAudioTrackProps {
  track: IAudioTrack;
}

export default function DelayedAudioTrack({ track }: DelayedAudioTrackProps) {
  const { audioDelay, audioContext } = useJourneyAppState();

  console.log('Delayed AudioTrack baseLatency', audioContext.baseLatency);

  useEffect(() => {
    const delayedTrack = audioContext.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
    const delayNode = new DelayNode(audioContext, { delayTime: 20 });
    delayedTrack.connect(delayNode);
    delayNode.connect(audioContext.destination);
    // delayedTrack.connect(audioContext.destination);
    return () => { delayNode.disconnect(); delayedTrack.disconnect() };
  }, [track, audioContext, audioDelay]);

  return null;
}
