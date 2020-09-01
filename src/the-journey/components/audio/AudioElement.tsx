import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioElementProps {
  track: IAudioTrack;
}

let counter = 0;

export default function AudioElement({ track }: AudioElementProps) {
  // const { activeSinkId } = useAppState();
  const audioEl = useRef<HTMLAudioElement>();

  console.log('hey! Its an AudioElement component');
  const n = ++counter;

  useEffect(() => {
    console.log('attaching element', n);
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    console.log('appending element', n, 'to document.body', audioEl.current);
    document.body.appendChild(audioEl.current);
    return () => {
      console.log('detaching element', n);
      track.detach().forEach(el => el.remove());
    }
  }, [track]);

  /*
  useEffect(() => {
    audioEl.current?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);
  */

  return null;
}
