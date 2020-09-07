import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { Participant } from 'twilio-video';
import useStreamNodes from './useStreamNodes';
import useAudioOut from './useAudioOut';
import { setDelay, setGain } from '../../utils/audio';
import { prevIfEqual } from '../../utils/react-help';

type Identity = Participant.Identity;

interface AudioStreamContextValues {
  getDelayTime: () => number,
  setDelayTime: (delayTime: number) => void,
  getGain: () => number,
  setGain: (gain: number) => void,
  setUnmutedGroup: (identities: string[]) => void,
}

const initialValues: AudioStreamContextValues = {
  getDelayTime: () => 0,
  setDelayTime: () => {},
  getGain: () => 1,
  setGain: () => {},
  setUnmutedGroup: () => {},
};

export const AudioStreamContext = createContext(initialValues);

export const MAX_STREAMS = 31;
export const DEFAULT_GAIN = 0.8;
export const DEFAULT_DELAY = 0;

interface ProviderProps {
  children: ReactNode,
}

export default function AudioStreamContextProvider({ children }: ProviderProps) {
  const [unmuted, setUnmuted] = useState<Identity[]>([]);
  const audioOut = useAudioOut(MAX_STREAMS, DEFAULT_GAIN, DEFAULT_DELAY);
  const nodes = useStreamNodes();

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
    if (!audioOut) return;
    nodes.forEach(([identity, trackSid, node]) => {
      if (unmuted.includes(identity)) node.connect(audioOut.outputNode);
      else node.disconnect();
    });
  }, [unmuted, nodes, audioOut])

  const setTheGain = useCallback((gain: number) =>
    setGain(gain, audioOut),
    [audioOut]);

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
  const contextValues = prevIfEqual('AudioStreamContext.value',
    { setUnmutedGroup, getDelayTime, setDelayTime, getGain, setGain: setTheGain });

  return <AudioStreamContext.Provider value={contextValues}>
    {children}
  </AudioStreamContext.Provider>
}
