import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';
import { remove } from '../../utils/functional';

interface AudioTrackProps {
  track: IAudioTrack;
}

const nodes: AudioNode[] = [];

export default function AudioNode({ track }: AudioTrackProps) {
  const audioContext = useAudioContext();

  useEffect(() => {
    console.log('audiocontext?')
    if (!audioContext) return;
    const newAC = new AudioContext() || audioContext
    console.log('yes, setting up node for', track.mediaStreamTrack);
    track.mediaStreamTrack.enabled = true;
    console.log('after enabled = true', track.mediaStreamTrack);
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = newAC.createMediaStreamSource(stream);
    nodes.push(node);
    node.connect(newAC.destination);
    return () => {
      node.disconnect();
      node.mediaStream.getAudioTracks().forEach(track => track.enabled = false);
      remove(nodes, node);
    }
  }, [audioContext]);

  return null;
}
