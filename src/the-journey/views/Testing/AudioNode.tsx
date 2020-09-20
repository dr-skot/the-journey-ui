import { useEffect, useState } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';
import { remove } from '../../utils/functional';

interface AudioTrackProps {
  track: IAudioTrack;
}

const nodes: AudioNode[] = [];

export default function AudioNode({ track }: AudioTrackProps) {
  const audioContext = useAudioContext();
  const [outputNode, setOutputNode] = useState<AudioNode>();

  useEffect(() => {
    if (!audioContext) return;
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.connect(audioContext.destination);
    setOutputNode(gainNode);
  }, [audioContext]);

  useEffect(() => {
    console.log('audiocontext?')
    if (!audioContext || !outputNode) return;
    console.log('yes, setting up node for', track.mediaStreamTrack);
    track.mediaStreamTrack.enabled = true;
    console.log('after enabled = true', track.mediaStreamTrack);
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = audioContext.createMediaStreamSource(stream);
    nodes.push(node);
    node.connect(outputNode);
    return () => {
      node.disconnect();
      node.mediaStream.getAudioTracks().forEach(track => track.enabled = false);
      remove(nodes, node);
    }
  }, [outputNode, audioContext, track.mediaStreamTrack]);

  return null;
}
