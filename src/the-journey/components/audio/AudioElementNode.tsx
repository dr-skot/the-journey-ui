import { useContext, useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { AppContext } from '../../contexts/AppContext';

interface AudioElementProps {
  track: IAudioTrack;
}

let counter = 0;

export default function AudioElementNode({ track }: AudioElementProps) {
  const [{ audioOut, activeSinkId }] = useContext(AppContext);
  const audioEl = useRef<HTMLAudioElement>();
  const elementNode = useRef<MediaElementAudioSourceNode>();


  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    if (audioOut?.audioContext) {
      elementNode.current = audioOut.audioContext.createMediaElementSource(audioEl.current);
      elementNode.current.connect(audioOut.outputNode);
    }
    audioOut?.audioContext?.resume();
    return () => {
      elementNode.current?.disconnect();
      track.detach().forEach(el => el.remove());
    }
  }, [track]);

  useEffect(() => {
    audioEl.current?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);

  return null;
}
