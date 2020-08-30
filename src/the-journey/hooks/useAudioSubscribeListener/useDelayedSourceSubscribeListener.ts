import { useEffect } from 'react';
import useDelayedStreamSources from './audio/useDelayedStreamSources';
import useRemoteTracks, { justTracks } from '../useRemoteTracks';
import useArrayDiffer from '../../utils/useArrayDiffer';

export default function useDelayedSourceSubscribeListener() {
  const tracks = justTracks('audio', useRemoteTracks());
  const { addTrack, removeTrack } = useDelayedStreamSources();
  // const diff = useArrayDiffer()
  const diff = (tracks: any[]) => ({ added: [], removed: [] });

  useEffect(() => {
    const { added, removed } = diff(tracks);
    added.forEach(addTrack);
    removed.forEach(removeTrack);
  }, [tracks, diff, addTrack, removeTrack]);
}
