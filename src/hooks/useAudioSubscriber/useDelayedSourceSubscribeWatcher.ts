import { useEffect } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { RemoteAudioTrack, RemoteTrackPublication } from 'twilio-video';
import useDelayedStreamSources from '../usePublications/useDelayedStreamSources';
import useParticipants from '../useParticipants/useParticipants';

export default function useAudioSubscribeWatcher() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const { addTrack, removeTrack } = useDelayedStreamSources();

  useEffect(() => {
    const publications = participants.flatMap(p => (
       Array.from(p.tracks.values()) as RemoteTrackPublication[]
    ));
    const audioTracks = publications.map((p) => p.track)
      .filter((track) => track?.kind === 'audio') as RemoteAudioTrack[];
    audioTracks.forEach((track) => { if (track) addTrack(track) });
  }, []);

  useEffect(() => {
    room.on('trackSubscribed', addTrack);
    room.on('trackUnsubscribed', removeTrack);

    return () => {
      room.off('trackSubscribed', addTrack);
      room.off('trackUnsubscribed', removeTrack);
    };
  }, [room, addTrack, removeTrack]);
}
