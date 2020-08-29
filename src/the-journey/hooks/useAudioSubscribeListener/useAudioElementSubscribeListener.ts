import { useEffect } from 'react';
import useAudioElements from './audio/useAudioElements';
import useRemoteTracks, { justTracks } from '../useRemoteTracks';
import useArrayDiffer from '../../utils/useArrayDiffer';

export default function useAudioElementSubscribeListener() {
  const tracks = justTracks('audio', useRemoteTracks());
  const { addTrack, removeTrack } = useAudioElements();
  const diff = useArrayDiffer([])

  useEffect(() => {
    const { added, removed } = diff(tracks);
    added.forEach(track => addTrack);
    removed.forEach(track => removeTrack);
  }, tracks);

}
