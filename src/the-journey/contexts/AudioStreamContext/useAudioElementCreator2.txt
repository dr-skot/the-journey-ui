import { Participant, RemoteAudioTrack } from 'twilio-video';
import { AudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';
import { getParticipants, inGroup } from '../../utils/twilio';
import { useAppContext } from '../AppContext';
import { constrain } from '../../utils/functional';
import { useSharedRoomState } from '../SharedRoomStateContext';

type Identity = Participant.Identity;

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

export default function useAudioElementCreator() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [{ room }] = useAppContext();
  const [participants, setParticipants] = useState<Participant[]>(getParticipants());
  const [{ gain, muteAll }] = useSharedRoomState();
  const [savedElements, setSavedElements] = useState<HTMLAudioElement[]>([]);

  const volume = muteAll ? 0 : constrain(0, 1)(gain);


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

  // when settings or participant list change, detach old elements, generate new ones
  useEffect(() => {
    const { muteAll, unmuteGroup } = settings;
    const tracks = muteAll ? [] : participants.filter(inGroup(unmuteGroup)).flatMap((p) => (
      Array.from(p.audioTracks.values())
        .map((pub) => pub.track)
        .filter((track) => !!track))) as RemoteAudioTrack[];
    const elements = tracks.map((track) => {
      console.log('creating audio element for', track);
      const audioElement = track.attach();
      audioElement.addEventListener('canplay', () => {
        const volumeSettable = audioElement as { volume: number };
        console.log('AudioTrack setting volume at creation to', volume);
        volumeSettable.volume = volume;
      });
      document.body.appendChild(audioElement);
      return audioElement;
    });
    setSavedElements(elements);
    return () => {
      tracks.forEach((track) => {
        track.detach().forEach((el) => el.remove())
      });
    };
  }, [settings, participants, setSavedElements]);

  // keep in sync with volume setting
  useEffect(() => {
    savedElements.forEach((audioElement) => {
      if (audioElement?.readyState !== 4) return;
      if (audioElement.volume !== volume) {
        const volumeSettable = audioElement as { volume: number };
        console.log('AudioTrack setting gain to', volume);
        volumeSettable.volume = volume;
      }
    })
  }, [volume])



  return unmuteGroup;
}
