import { useCallback, useState } from 'react';
import { omit } from 'lodash';
import { RemoteAudioTrack } from 'twilio-video';

export default function useAudioElements() {
  const [audioElements, setAudioElements] = useState<Record<string, RemoteAudioTrack>>({});

  const addTrack = useCallback((track: RemoteAudioTrack) => {
    if (track.kind !== 'audio') return;
    if (audioElements[track.sid]) return;
    console.log('creating audioElement for track', track);
    const audioElement = track.attach();
    audioElement.setAttribute('data-cy-audio-track-name', track.name);
    document.body.appendChild(audioElement);
    setAudioElements(prevAudioElements => ({ ...prevAudioElements, [track.sid]: track }));
  }, [audioElements]);

  const removeTrack = useCallback((track: RemoteAudioTrack) => {
    if (track.kind !== 'audio') return;
    console.log('removing audioElement for track');
    track.detach().forEach(el => el.remove());
    setAudioElements(prevAudioElements => omit(prevAudioElements, [track.sid]));
  }, []);

  return { addTrack, removeTrack };
}
