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
    console.log('yes, setting up node for', track.mediaStreamTrack);
    const destination = audioContext.createMediaStreamDestination();

    const mediaStreamTrack = track.mediaStreamTrack //.clone(); // use a clone?? is this the key?
    // chrome seems to require this
    // mediaStreamTrack.enabled = true;
    // console.log('after enabled = true', mediaStreamTrack);
    const stream = new MediaStream([mediaStreamTrack])
    const node = audioContext.createMediaStreamSource(stream);
    nodes.push(node);
    node.connect(destination);
    // Then, set the MediaStreamDestinationNode's MediaStream as the `srcObject` on an
    // <audio> or <video> element.
    var audio = document.createElement('audio');
    audio.srcObject = destination.stream;
    audio.autoplay = true;
    document.body.appendChild(audio);
    return () => {
      console.log('disconnecting node')
      audio.pause();
      audio.remove();
      node.disconnect();
      remove(nodes, node);
    }
  }, [audioContext, track.mediaStreamTrack]);

  return null;
}
