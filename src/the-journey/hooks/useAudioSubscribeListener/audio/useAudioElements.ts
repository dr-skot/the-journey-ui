import { useCallback, useState } from 'react';
import { omit } from 'lodash';
import { RemoteAudioTrack } from 'twilio-video';

export default function useAudioElements() {
  const [audioElements, setAudioElements] = useState<Record<string, RemoteAudioTrack>>({});

  const addTrack = useCallback((track: RemoteAudioTrack) => {
    console.log('HELLO IM REALLY DOING IT NOW');
    if (track.kind !== 'audio') return;
    console.log('IT WAS AUDIO');
    if (audioElements[track.sid]) audioElements[track.sid].detach();
    console.log('WE MIGHT HAVE ALREADY HAD ONE FOR IT');
    console.log('creating audioElement for track', track);
    const audioElement = track.attach();
    audioElement.setAttribute('data-cy-audio-track-name', track.name);
    console.log('ADDING ELEMENT TO DOCUMENT');
    document.body.appendChild(audioElement);
    setAudioElements(prevAudioElements => ({ ...prevAudioElements, [track.sid]: track }));
  }, []);

  const removeTrack = useCallback((track: RemoteAudioTrack) => {
    if (track.kind !== 'audio') return;
    console.log('removing audioElement for track');
    track.detach().forEach(el => el.remove());
    setAudioElements(prevAudioElements => omit(prevAudioElements, [track.sid]));
  }, []);

  return { addTrack, removeTrack };
}
