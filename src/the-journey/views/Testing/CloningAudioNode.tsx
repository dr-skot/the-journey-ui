import { useEffect, useState } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';
import { remove } from '../../utils/functional';

interface AudioTrackProps {
  track: IAudioTrack;
}

const nodes: AudioNode[] = [];

export default function CloningAudioNode({ track }: AudioTrackProps) {
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
    const mediaStreamTrack = track.mediaStreamTrack.clone(); // use a clone?? is this the key?
    mediaStreamTrack.enabled = true;
    console.log('after enabled = true', mediaStreamTrack);
    const stream = new MediaStream([mediaStreamTrack])
    const node = audioContext.createMediaStreamSource(stream);
    nodes.push(node);
    node.connect(outputNode);
    return () => {
      console.log('disconnecting node')
      node.mediaStream.getTracks().forEach(track => {
        // track.stop();
        track.enabled = false;
      });
      node.disconnect();
      remove(nodes, node);
    }
  }, [outputNode, audioContext, track.mediaStreamTrack]);

  return null;
}
