import { useContext, useEffect, useState } from 'react';
import { Participant, RemoteAudioTrack, RemoteAudioTrackPublication, RemoteParticipant } from 'twilio-video';

import { Sid } from 'twilio/lib/interfaces';
import { AppContext } from '../AppContext';
import useAudioContext from './useAudioContext';
type Identity = Participant.Identity;
export type TrackRecord = [Identity, Sid, MediaStreamAudioSourceNode];

function getNode(audioContext: AudioContext, track: RemoteAudioTrack) {
  const stream = new MediaStream([track.mediaStreamTrack])
  return audioContext.createMediaStreamSource(stream);
}

// This beast manages the audio in the room.
// It maintains a table of AudioNodes for all remote audio streams,
// keyed by trackId and the identity of who published them.
// It stays up to date as tracks appear and disappear (are subscribed and unsubscribed to),
// wrapping them in nodes when they arrive, disconnecting the nodes when they leave

export default function useStreamNodes() {
  const [{ room }] = useContext(AppContext);
  const audioContext = useAudioContext();
  const [nodes, setNodes] = useState<TrackRecord[]>([]);

  useEffect(() => {
    if (!room || !audioContext) return;

    function addStreamSource(track: RemoteAudioTrack, { trackSid }: RemoteAudioTrackPublication,
                             { identity }: RemoteParticipant) {
      const node = getNode(audioContext!, track);
      setNodes((prev) => [...prev, [identity, trackSid, node]]);
    }

    function removeStreamSource(track: RemoteAudioTrack, { trackSid }: RemoteAudioTrackPublication,
                                { identity }: RemoteParticipant) {
      setNodes((prev) => {
        prev.forEach(([id, sid, node]: TrackRecord) => {
          if (id === identity && sid === trackSid) node.disconnect();
        });
        return prev.filter(([id, sid,]: TrackRecord) => !(id === identity && sid === trackSid));
      });
    }

    room.participants.forEach((participant) =>
      participant.audioTracks.forEach((publication) => {
        if (publication.track) addStreamSource(publication.track, publication, participant);
      }));

    room.on('trackSubscribed', addStreamSource)
    room.on('trackSubscribed', removeStreamSource)

    return () => {
      room.off('trackSubscribed', addStreamSource)
      room.off('trackSubscribed', removeStreamSource)
      setNodes((prev) => {
        prev.forEach(([,, node]) => node.disconnect());
        return [];
      });
    };
  }, [room, audioContext]);

  return nodes;
}
