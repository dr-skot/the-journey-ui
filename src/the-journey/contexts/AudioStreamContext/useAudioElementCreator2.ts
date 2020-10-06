import { Participant, RemoteAudioTrack, RemoteParticipant } from 'twilio-video';
import { AudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';
import { getParticipants, inGroup } from '../../utils/twilio';
import { useTwilioRoomContext } from '../TwilioRoomContext';
import { constrain } from '../../utils/functional';
import { flatMap } from 'lodash';
import { playStreams } from './AudioManager';

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

  // update participant list when track subscriptions change
  useEffect(() => {
    if (!room) return;
    const resetParticipants = () => setParticipants(Array.from(room!.participants.values()));
    room.on('trackSubscribed', resetParticipants);
    return () => { room.off('trackSubscribed', resetParticipants); }
  }, [room])

  // reset settings when unmuteGroup is called
  function unmuteGroup(unmuteGroup: Identity[], muteAll: boolean, audioOut?: AudioOut, gain?: number) {
    setSettings({ muteAll, audioOut, unmuteGroup, gain: gain || settings.gain } as Settings);
  }

  // when settings or participant list change, play streams
  useEffect(() => {
    const { muteAll, unmuteGroup, gain } = settings;
    const volume = constrain(0, 1)(gain);
    playStreams({ participants, unmuteGroup, volume, muteAll });
  }, [settings, participants]);

  return unmuteGroup;
}
