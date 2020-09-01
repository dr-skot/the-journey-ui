import { useContext, useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { AppContext } from '../../contexts/AppContext';

interface AudioTrackProps {
  track: IAudioTrack;
}

let counter = 0;

export default function StreamSource({ track }: AudioTrackProps) {
  const [{ audioOut }] = useContext(AppContext);
  const streamSource = useRef<MediaStreamAudioSourceNode>()

  console.log('hey! Its a StreamSource component');

  useEffect(() => {
    console.log('stream source wants to connect, good thing theres an audio context:', audioOut?.audioContext);
    if (!audioOut?.audioContext) return;
    console.log('audioContext state', audioOut.audioContext.state);
    console.log('creating streamSource for track', track);
    const stream = new MediaStream([track.mediaStreamTrack])
    streamSource.current?.disconnect();
    streamSource.current = audioOut.audioContext.createMediaStreamSource(stream);
    const n = ++counter;
    console.log('connecting stream source', n, streamSource);
    streamSource.current.connect(audioOut.outputNode);
    audioOut.delayNode.connect(audioOut.gainNode);
    audioOut.gainNode.connect(audioOut.audioContext.destination);
    audioOut.audioContext.resume();
    return () => {
      console.log('disconnecting stream source', n);
      streamSource.current?.disconnect();
    }
  }, [track, audioOut?.audioContext]);

  return null;
}
