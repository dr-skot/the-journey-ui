import { useContext, useEffect } from 'react';
import useAudioElements from './audio/useAudioElements';
import useArrayDiffer from '../../utils/useArrayDiffer';
import { AppContext } from '../../contexts/AppContext';
import { extractTracks } from '../../utils/twilio';

export default function useAudioElementSubscribeListener() {
  const [{ audioTracks }] = useContext(AppContext);
  const { addTrack, removeTrack } = useAudioElements();
  // const diff = useArrayDiffer()

  const tracks = extractTracks(audioTracks);

  useEffect(() => {
    // const { added, removed } = diff(tracks);
    console.log('change in the audio tracks', [audioTracks, tracks])
    console.log('Im just going to only add');
    tracks.forEach(track => { if (track) addTrack(track) });
    // added.forEach(addTrack);
    // removed.forEach(removeTrack);
  }, [tracks, addTrack, removeTrack]);

}
