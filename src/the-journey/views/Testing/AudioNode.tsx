import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';

interface AudioTrackProps {
  track: IAudioTrack;
}

const nodes: AudioNode[] = [];

function remove(xs: any[], x: any) {
  const i = xs.indexOf(x);
  if (i === -1) return;
  xs.splice(i, 1);
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
    nodes.push(node);
    node.connect(newAC.destination);
    return () => {
      node.disconnect();
      remove(nodes, node);
    }
  }, [audioContext]);

  return null;
}
