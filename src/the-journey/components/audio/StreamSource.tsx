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

  useEffect(() => {
    if (!audioOut?.audioContext) return;
    const stream = new MediaStream([track.mediaStreamTrack])
    streamSource.current?.disconnect();
    streamSource.current = audioOut.audioContext.createMediaStreamSource(stream);
    const n = ++counter;
    streamSource.current.connect(audioOut.outputNode);
    audioOut.delayNode.connect(audioOut.gainNode);
    audioOut.gainNode.connect(audioOut.audioContext.destination);
    audioOut.audioContext.resume();
    return () => {
      streamSource.current?.disconnect();
    }
  }, [track, audioOut?.audioContext]);

  return null;
}
