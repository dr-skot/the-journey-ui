import { Participant, RemoteAudioTrack, RemoteParticipant } from 'twilio-video';
import { AudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';
import { getParticipants, inGroup } from '../../utils/twilio';
import { useTwilioRoomContext } from '../TwilioRoomContext';
import { constrain } from '../../utils/functional';
import { flatMap } from 'lodash';

type Identity = Participant.Identity;

interface Settings {
  muteAll: boolean,
  audioOut?: AudioOut,
  unmuteGroup: Identity[],
  gain: number,
}

const initialSettings: Settings = {
  muteAll: false,
  audioOut: undefined,
  unmuteGroup: [],
  gain: 1,
}

export default function useAudioElementCreator() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [{ room }] = useTwilioRoomContext();
  const [participants, setParticipants] = useState<Participant[]>(getParticipants());

  // don't miss new tracks
  useEffect(() => {
    if (!room) return;
    function resetParticipants() {
      setParticipants(Array.from(room!.participants.values()));
    }
    // TODO what about unsubscribed
    room.on('trackSubscribed', resetParticipants);
    room.on('trackUnsubscribed', resetParticipants);
    return () => {
      room.off('trackSubscribed', resetParticipants);
      room.off('trackUnsubscribed', resetParticipants);
    }
  }, [room])

  // reset settings when unmute group changes
  function unmuteGroup(unmuteGroup: Identity[], muteAll: boolean, audioOut?: AudioOut, gain?: number) {
    setSettings({ muteAll, audioOut, unmuteGroup, gain: gain || settings.gain } as Settings);
  }

  // when settings or participant list change, detach old elements, generate new ones
  useEffect(() => {
    const { muteAll, unmuteGroup, gain } = settings;
    const volume = constrain(0, 1)(gain);
    const tracks = muteAll
      ? []
      : flatMap(participants.filter(inGroup(unmuteGroup)), ((p: RemoteParticipant) => (
        Array.from(p.audioTracks.values())
          .map((pub) => pub.track)
          .filter((track) => track !== null)))) as unknown as RemoteAudioTrack[];
    console.log('attaching', tracks.length, 'tracks to elements');
    tracks.forEach((track) => {
      const audioElement = track.attach();
      audioElement.addEventListener('canplay', () => {
        const volumeSettable = audioElement as { volume: number };
        console.log('AudioTrack setting volume at creation to', volume);
        volumeSettable.volume = volume;
      });
      document.body.appendChild(audioElement);
    });
    return () => {
      console.log('detaching', tracks.length, 'tracks from elements');
      tracks.forEach((track) => {
        track.detach().forEach((el) => el.remove())
      });
    };
  }, [settings, participants]);

  return unmuteGroup;
}
