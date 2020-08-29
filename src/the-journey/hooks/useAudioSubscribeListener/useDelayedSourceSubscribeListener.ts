import { useEffect } from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { RemoteAudioTrack, RemoteTrackPublication } from 'twilio-video';
import useDelayedStreamSources from './audio/useDelayedStreamSources';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import useRemoteTracks, { justTracks } from '../useRemoteTracks';
import useAudioElements from './audio/useAudioElements';
import useArrayDiffer from '../../utils/useArrayDiffer';

export default function useDelayedSourceSubscribeListener() {
  const tracks = justTracks('audio', useRemoteTracks());
  const { addTrack, removeTrack } = useDelayedStreamSources();
  const diff = useArrayDiffer([])

  useEffect(() => {
    const { added, removed } = diff(tracks);
    added.forEach(track => addTrack);
    removed.forEach(track => removeTrack);
  }, tracks);
}
