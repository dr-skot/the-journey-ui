import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';
import { remove } from '../../utils/functional';

interface AudioTrackProps {
  track: IAudioTrack;
}

const nodes: AudioNode[] = [];

export default function AudioNodeOrElement({ track }: AudioTrackProps) {
  const audioContext = useAudioContext();

  useEffect(() => {
    console.log('audiocontext?')
    if (!audioContext) return;
    const newAC = new AudioContext() || audioContext
    // const newAC = audioContext;
    console.log('yes, setting up node for', track.mediaStreamTrack);
    if (!track.mediaStreamTrack.enabled) {
      // no joy from this track, fallback to element
      console.log('element disabled; falling back to element');
      const audioElement = track.attach();
      audioElement.setAttribute('data-cy-audio-track-name', track.name);
      document.body.appendChild(audioElement);
      audioElement.volume = 0.1;
      return () => track.detach().forEach(el => el.remove())
    }
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = newAC.createMediaStreamSource(stream);
    console.log('attaching node', node);
    nodes.push(node);
    node.connect(newAC.destination);
    return () => {
      node.disconnect();
      // node.mediaStream.getAudioTracks().forEach(track => track.enabled = false);
      remove(nodes, node);
    }
  }, [audioContext]);

  return null;
}
