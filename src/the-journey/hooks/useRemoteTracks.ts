import { useEffect, useState, useCallback } from 'react';
import { Participant, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from 'twilio-video';
import useParticipants from './useParticipants/useParticipants';
import { useAppContext } from '../contexts/AppContext';
import { SubscribedTrackKind } from 'twilio/lib/rest/video/v1/room/roomParticipant/roomParticipantSubscribedTrack';

type ParticipantTracks = Record<Participant.Identity, RemoteTrack[]>;

const getTracks = (participants: RemoteParticipant[], kind: SubscribedTrackKind) => {
  const tracks: ParticipantTracks = {};
  participants.forEach((p) => {
    const collection: Map<string, RemoteTrackPublication> = kind === 'audio' ? p.audioTracks
      : kind === 'video' ? p.videoTracks
        : kind === 'data' ? p.dataTracks
          : p.tracks;
    if (collection.size > 0) {
      tracks[p.identity] =
        Array.from(collection.values()).map(pub => pub.track).filter(track => !!track) as RemoteTrack[];
    }
  });
  return tracks;
}

export default function useRemoteTracks(kind: SubscribedTrackKind) {
  const [{ room }] = useAppContext();
  const participants = useParticipants();
  const [tracks, setTracks] = useState<ParticipantTracks>({});

  const resetTracks = useCallback(() =>
    setTracks(getTracks(participants as RemoteParticipant[], kind)), [participants]);

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
