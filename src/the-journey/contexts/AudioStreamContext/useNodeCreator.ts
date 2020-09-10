import { Participant, RemoteAudioTrack } from 'twilio-video';
import { AudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';
import { getParticipants, inGroup } from '../../utils/twilio';
import { useAppContext } from '../AppContext';
import { remove } from '../../utils/functional';

type Identity = Participant.Identity;

// keep nodes here while in use so they don't get garbage-collected
const nodeStore: AudioNode[] = [];

function getNode(audioContext: AudioContext, track: RemoteAudioTrack) {
  const stream = new MediaStream([track.mediaStreamTrack])
  return audioContext.createMediaStreamSource(stream);
}


interface Settings {
  muteAll: boolean,
  audioOut?: AudioOut,
  unmuteGroup: Identity[],
}

const initialSettings: Settings = {
  muteAll: false,
  audioOut: undefined,
  unmuteGroup: [],
}

export default function useNodeCreator() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [{ room }] = useAppContext();
  const [participants, setParticipants] = useState<Participant[]>(getParticipants());

  // don't miss new tracks
  useEffect(() => {
    if (!room) return;
    function resetParticipants() {
      setParticipants(Array.from(room!.participants.values()));
    }
    room.on('trackSubscribed', resetParticipants);
    return () => { room.off('trackSubscribed', resetParticipants); }
  }, [room])

  // reset settings when unmute group changes
  function unmuteGroup(unmuteGroup: Identity[], muteAll: boolean, audioOut?: AudioOut) {
    setSettings({ muteAll, audioOut, unmuteGroup } as Settings);
  }

  // when settings or participant list change, disconnect old nodes, then make new nodes and connect them
  useEffect(() => {
    const { muteAll, audioOut, unmuteGroup } = settings;
    if (!audioOut) return;
    const nodes = muteAll ? [] : participants.filter(inGroup(unmuteGroup)).flatMap((p) => (
      Array.from(p.audioTracks.values()).filter((pub) => !!pub?.track)
        .map((pub) => getNode(audioOut.audioContext, pub.track as RemoteAudioTrack))
        .filter((node) => !!node)
      )
    );
    nodes.forEach((node) => {
      node.connect(audioOut.outputNode);
      nodeStore.push(node);
    });
    return () => { nodes.forEach((node) => {
      node.disconnect();
      remove(nodeStore, node);
    }) }
  }, [settings, participants]);

  return unmuteGroup;
}
