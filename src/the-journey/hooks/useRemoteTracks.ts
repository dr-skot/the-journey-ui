import { useEffect, useState, useCallback } from 'react';
import { RemoteParticipant, RemoteTrack } from 'twilio-video';
import useParticipants from '../../twilio/hooks/useParticipants/useParticipants';
import useVideoContext from './useVideoContext';

interface ParticipantTracks {
  participant: RemoteParticipant,
  tracks: RemoteTrack[],
}

const getTracks = (participants: RemoteParticipant[]) => participants.map((p) => ({
  participant: p,
  tracks: Array.from(p.tracks.values()).map(p => p.track) as RemoteTrack[],
}));

export function justTracks(kind: string, participantTracks: ParticipantTracks[]) {
  return participantTracks.flatMap(pt => pt.tracks).filter(track => track?.kind === kind);
};

export default function useRemoteTracks() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const [tracks, setTracks] = useState<ParticipantTracks[]>([]);

  const resetTracks = (
    useCallback(() => setTracks(getTracks(participants as RemoteParticipant[])), [participants])
  );

  useEffect(resetTracks, [participants]);

  useEffect(() => {
    room?.on('trackSubscribed', resetTracks);
    room?.on('trackUnsubscribed', resetTracks);
    return () => {
      room?.off('trackSubscribed', resetTracks);
      room?.off('trackUnsubscribed', resetTracks);
    }
  });

  return tracks;
}
