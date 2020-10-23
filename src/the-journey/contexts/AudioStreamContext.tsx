import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { isEqual, pick, values, flatMap } from 'lodash';
import { Participant, RemoteAudioTrack } from 'twilio-video';
import { cached } from '../utils/react-help';
import { getDelayTime, getGain, playTracks, setDelayTime, setGain } from '../utils/trackPlayer';
import useRemoteTracks from '../hooks/useRemoteTracks';

type Identity = Participant.Identity;

interface AudioStreamContextValues {
  getDelayTime: () => number,
  setDelayTime: (delayTime: number) => void,
  getGain: () => number,
  setGain: (gain: number) => void,
  setUnmutedGroup: (identities: string[]) => void,
  muteAll: boolean,
  setMuteAll: (setState: React.SetStateAction<boolean>) => void,
}

const initialValues: AudioStreamContextValues = {
  getDelayTime,
  setDelayTime,
  getGain,
  setGain,
  setUnmutedGroup: () => {},
  muteAll: false,
  setMuteAll: () => {},
};

export const AudioStreamContext = createContext(initialValues);

interface ProviderProps {
  children: ReactNode,
}

export default function AudioStreamContextProvider({ children }: ProviderProps) {
  const trackMap = useRemoteTracks('audio') as Record<Identity, RemoteAudioTrack[]>;
  const [unmuted, setUnmuted] = useState<Identity[]>([]);
  const [muteAll, setMuteAll] = useState(false);

  const setUnmutedGroup = useCallback((group: Identity[]) => {
    setUnmuted((prev) => {
      const value = isEqual(group.sort(), prev) ? prev : group;
      console.log('unmuted group going from', prev, 'to', value);
      return value;
    });
  }, [setUnmuted]);

  // connect up only the streams that are in the unmuted group
  useEffect(() => {
    playTracks(muteAll ? [] : flatMap(values(pick(trackMap, unmuted))));
  }, [unmuted, muteAll, trackMap]);

  console.log('AudioStreamContext.Provider rerender');

  const contextValues = cached('AudioStreamContext.value').ifEqual({
    setUnmutedGroup, getDelayTime, setDelayTime, getGain, setGain, muteAll, setMuteAll,
  }) as AudioStreamContextValues;

  return <AudioStreamContext.Provider value={contextValues}>
    {children}
  </AudioStreamContext.Provider>
}
