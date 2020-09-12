import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useSharedRoomState } from '../../../contexts/SharedRoomContext';
import { constrain } from '../../../utils/functional';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const [{ gain, muteAll }] = useSharedRoomState();
  const audioEl = useRef<HTMLAudioElement>();

  const volume = muteAll ? 0 : constrain(0, 1)(gain);

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    audioEl.current.addEventListener('canplay', () => {
      const volumeSettable = audioEl.current as { volume: number };
      console.log('AudioTrack setting volume at creation to', gain);
      volumeSettable.volume = volume;
    });
    document.body.appendChild(audioEl.current);
    return () => track.detach().forEach(el => el.remove());
  }, [track]);

  useEffect(() => {
    if (audioEl.current?.readyState !== 4) return;
    if (audioEl.current.volume !== volume) {
      const volumeSettable = audioEl.current as { volume: number };
      console.log('AudioTrack setting gain to', volume);
      volumeSettable.volume = volume;
    }
  }, [volume])

  return null;
}