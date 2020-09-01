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

  console.log('hey! Its an AudioElementNode component');
  const n = ++counter;

  useEffect(() => {
    console.log('attaching element', n);
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    if (audioOut?.audioContext) {
      console.log('creating mediaelementnode');
      elementNode.current = audioOut.audioContext.createMediaElementSource(audioEl.current);
      console.log('connecting to outputnode');
      elementNode.current.connect(audioOut.outputNode);
    }
    console.log('not appending element', n, 'to document.body', audioEl.current);
    // document.body.appendChild(audioEl.current);
    audioOut?.audioContext?.resume();
    return () => {
      console.log('detaching element', n);
      elementNode.current?.disconnect();
      track.detach().forEach(el => el.remove());
    }
  }, [track]);

  useEffect(() => {
    audioEl.current?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);

  return null;
}
