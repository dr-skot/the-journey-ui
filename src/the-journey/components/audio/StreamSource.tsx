import { useContext, useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { AppContext } from '../../contexts/AppContext';

interface AudioTrackProps {
  track: IAudioTrack;
}

let counter = 0;

export default function StreamSource({ track }: AudioTrackProps) {
  const [{ audioOut }] = useContext(AppContext);

  console.log('hey! Its a StreamSource component');

  useEffect(() => {
    console.log('stream source wants to connect, good thing theres an audio context:', audioOut?.audioContext);
    if (!audioOut?.audioContext) return;
    console.log('creating streamSource for track', track);
    const stream = new MediaStream([track.mediaStreamTrack])
    const streamSource = audioOut.audioContext.createMediaStreamSource(stream);
    const n = ++counter;
    console.log('connecting stream source', n)
    streamSource.connect(audioOut.outputNode);
    return () => {
      console.log('disconnecting stream source', n);
      streamSource.disconnect();
    }
  }, [track, audioOut?.audioContext]);

  return null;
}
