import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioElementProps {
  track: IAudioTrack;
}

let counter = 0;

export default function AudioElement({ track }: AudioElementProps) {
  // const { activeSinkId } = useAppState();
  const audioEl = useRef<HTMLAudioElement>();

  const n = ++counter;

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    document.body.appendChild(audioEl.current);
    return () => {
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
