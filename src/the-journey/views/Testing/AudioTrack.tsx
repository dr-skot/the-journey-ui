import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const audioEl = useRef<HTMLAudioElement>();

  useEffect(() => {
    let retries = 5;

    function destroy() {
      track.detach().forEach(el => el.remove())
    }

    function create() {
      audioEl.current = track.attach();
      audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
      document.body.appendChild(audioEl.current);
      setTimeout(() => {
        if (!audioEl.current?.paused) return;
        destroy();
        if (retries-- > 0) create();
      }, 500)
    }

    create();
    return destroy;
  }, [track]);

  return null;
}