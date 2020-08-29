import useParticipants from '../../hooks/useParticipants/useParticipants';
import { RemoteAudioTrackPublication, RemoteTrackPublication } from 'twilio-video';
import { useEffect, useState } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function useAudioPublications() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const [publications, setPublications] = useState<RemoteAudioTrackPublication[]>([]);

  useEffect(() => {
    setPublications(participants.flatMap(p => (
      Array.from(p.tracks.values()) as RemoteTrackPublication[]

    ).filter(p => p.kind === 'audio')) as RemoteAudioTrackPublication[]);

    const publicationAdded = (publication: RemoteTrackPublication) => {
      if (publication.kind === 'audio') {
        setPublications(prevPublications => [...prevPublications, publication as RemoteAudioTrackPublication]);
      }
    }
    const publicationRemoved = (publication: RemoteTrackPublication) => {
      if (publication.kind === 'audio') {
        setPublications(prevPublications => prevPublications.filter(p => p !== publication));
      }
    }

    room.on('trackSubscribed', publicationAdded);
    room.on('trackUnsubscribed', publicationRemoved);

    return () => {
      room.off('trackSubscribed', publicationAdded);
      room.off('trackUnsubscribed', publicationRemoved);
    };
  }, [room]);

  return publications;
}
