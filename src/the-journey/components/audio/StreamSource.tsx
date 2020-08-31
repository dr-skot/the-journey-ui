import { useContext, useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { AppContext } from '../../contexts/AppContext';

function applyDelay(audioContext: AudioContext, streamSource: MediaStreamAudioSourceNode, delayTime: number) {
  const delayNode = audioContext.createDelay(10);
  delayNode.delayTime.value = delayTime;
  streamSource.connect(delayNode).connect(audioContext.destination);
}

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function StreamSource({ track }: AudioTrackProps) {
  const [{ audioContext, audioDelay }] = useContext(AppContext);
  const streamSource = useRef<MediaStreamAudioSourceNode>();

  useEffect(() => {
    console.log('creating streamSource for track', track);
    streamSource.current = audioContext.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
    applyDelay(audioContext, streamSource.current, audioDelay);
    return () => streamSource.current?.disconnect();
  }, [track, audioContext, audioDelay]);

  return null;
}
