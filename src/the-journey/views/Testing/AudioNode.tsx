import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioNode({ track }: AudioTrackProps) {
  const audioContext = useAudioContext();

  useEffect(() => {
    console.log('audiocontext?')
    if (!audioContext) return;
    const newAC = new AudioContext() || audioContext
    console.log('yes, setting up node for', track.mediaStreamTrack);
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = newAC.createMediaStreamSource(stream);
    node.connect(newAC.destination);
    return () => node.disconnect();
  }, [audioContext]);

  return null;
}
