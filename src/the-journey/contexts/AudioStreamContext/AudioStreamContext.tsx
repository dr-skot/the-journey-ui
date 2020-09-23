import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { Participant } from 'twilio-video';
import useAudioOut from './useAudioOut';
import { setDelay, setGain, setDocumentVolume } from '../../utils/audio';
import { cached } from '../../utils/react-help';
import useNodeCreator from './useNodeCreator';
import useAudioElementCreator from './useAudioElementCreator';

type Identity = Participant.Identity;

interface AudioStreamContextValues {
  getDelayTime: () => number,
  setDelayTime: (delayTime: number) => void,
  getGain: () => number,
  setGain: (gain: number) => void,
  setUnmutedGroup: (identities: string[]) => void,
  muteAll: boolean,
  setMuteAll: (setState: React.SetStateAction<boolean>) => void,
  setFallback: (setting: boolean) => void,
}

const initialValues: AudioStreamContextValues = {
  getDelayTime: () => 0,
  setDelayTime: () => {},
  getGain: () => 1,
  setGain: () => {},
  setUnmutedGroup: () => {},
  muteAll: false,
  setMuteAll: () => {},
  setFallback: () => {},
};

export const AudioStreamContext = createContext(initialValues);

export const MAX_STREAMS = 32;
export const DEFAULT_GAIN = 0.8;
export const DEFAULT_DELAY = 0;

interface ProviderProps {
  children: ReactNode,
}

export default function AudioStreamContextProvider({ children }: ProviderProps) {
  const [unmuted, setUnmuted] = useState<Identity[]>([]);
  const [muteAll, setMuteAll] = useState(false);
  const [gainValue, setGainValue] = useState(DEFAULT_GAIN);
  const [fallback, setFallback] = useState(false);
  const audioOut = useAudioOut(MAX_STREAMS, DEFAULT_GAIN, DEFAULT_DELAY);
  const ambitiousUnmuteGroup = useNodeCreator();
  const fallbackUnmuteGroup = useAudioElementCreator();

  const setUnmutedGroup = useCallback((group: Identity[]) => {
    setUnmuted((prev) => {
      const value = isEqual(group.sort(), prev) ? prev : group;
      console.log('unmuted group going from', prev, 'to', value);
      return value;
    });
  }, [setUnmuted]);

  // connect up only the streams that are in the unmuted group
  useEffect(() => {
    console.log('unmuted changed with audioOut', audioOut);
    const methods = [fallbackUnmuteGroup, ambitiousUnmuteGroup]
    const [activeMethod, inactiveMethod] = fallback ? methods : methods.reverse();
    inactiveMethod([], true, audioOut, gainValue);
    activeMethod(unmuted, muteAll, audioOut, gainValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unmuted, muteAll, audioOut, fallback])

  const setTheGain = useCallback((gain: number) => {
    setGainValue(gain);
    setGain(gain, audioOut);
    setDocumentVolume(gain);
  },[audioOut]);

  const getGain = useCallback(() =>
    audioOut?.gainNode.gain.value || 1,
    [audioOut]);

  const setDelayTime = useCallback((delayTime: number) =>
      setDelay(delayTime, audioOut),
    [audioOut]);

  const getDelayTime = useCallback(() =>
      audioOut?.delayNode.delayTime.value || 0,
    [audioOut]);

  console.log('AudioStreamContext.Provider rerender');
  // reportEqual({ setUnmutedGroup, getDelayTime, setDelayTime, getGain, setTheGain });
  const contextValues = cached('AudioStreamContext.value').ifEqual({
    setUnmutedGroup, getDelayTime, setDelayTime, getGain, setGain: setTheGain, muteAll, setMuteAll, setFallback,
  }) as AudioStreamContextValues;

  return <AudioStreamContext.Provider value={contextValues}>
    {children}
  </AudioStreamContext.Provider>
}
