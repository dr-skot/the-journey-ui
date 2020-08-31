import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useDelayedStreamSources from './audio/useDelayedStreamSources';
import useArrayDiffer from '../../utils/useArrayDiffer';
import { extractTracks } from '../../utils/twilio';

export default function useDelayedSourceSubscribeListener() {
  const [{ audioTracks }] = useContext(AppContext);
  const { addTrack, removeTrack } = useDelayedStreamSources();
  const diff = useArrayDiffer()

  useEffect(() => {
    const tracks = extractTracks(audioTracks);
    console.log('change in the audio tracks', [audioTracks, tracks])
    tracks.forEach(track => { if (track) addTrack(track) });
    //const { added, removed } = diff(tracks);
    //added.forEach(addTrack);
    //removed.forEach(removeTrack);
  }, [audioTracks, diff, addTrack, removeTrack]);

}
