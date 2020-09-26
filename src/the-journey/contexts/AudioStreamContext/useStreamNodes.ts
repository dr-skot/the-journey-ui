import { useContext, useEffect, useState } from 'react';
import { Participant, RemoteAudioTrack, RemoteAudioTrackPublication, RemoteParticipant } from 'twilio-video';

import { Sid } from 'twilio/lib/interfaces';
import { TwilioRoomContext } from '../TwilioRoomContext';
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
  const [nodes, setNodes] = useState<TrackRecord[]>([]);
  const audioContext = useAudioContext();
  const [{ room }] = useContext(TwilioRoomContext);

  useEffect(() => {
    if (!room || !audioContext) return;
    const me = room.localParticipant;

    function addStreamSource(track: RemoteAudioTrack, { trackSid }: RemoteAudioTrackPublication,
                             { identity }: RemoteParticipant) {
      if (identity === me.identity || track.kind !== 'audio') return;
      console.log('addStreamSource for track', track);
      const node = getNode(audioContext!, track);
      setNodes((prev) => [...prev, [identity, trackSid, node]]);
    }

    function removeStreamSource(track: RemoteAudioTrack, { trackSid }: RemoteAudioTrackPublication,
                                { identity }: RemoteParticipant) {
      console.log('removeStreamSource for track', track);
      setNodes((prev) => {
        prev.forEach(([id, sid, node]: TrackRecord) => {
          if (id === identity && sid === trackSid) node.disconnect();
        });
        return prev.filter(([id, sid,]: TrackRecord) => !(id === identity && sid === trackSid));
      });
    }

    room.participants.forEach((participant) => {
      if (participant.identity === me.identity) return;
      participant.audioTracks.forEach((publication) => {
        if (publication.track) addStreamSource(publication.track, publication, participant);
      })
    });

    room.on('trackSubscribed', addStreamSource)
    room.on('trackUnsubscribed', removeStreamSource)

    return () => {
      room.off('trackSubscribed', addStreamSource)
      room.off('trackUnsubscribed', removeStreamSource)
      setNodes((prev) => {
        prev.forEach(([,, node]) => node.disconnect());
        return [];
      });
    };
  }, [room, audioContext]);

  return nodes;
}
