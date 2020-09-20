import { AudioOut, getAudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';

export default function useAudioOut(inputs?: number, gain?: number, delay?: number) {
  const [audioOut, setAudioOut] = useState<AudioOut>();

  useEffect(() => {
    if (!audioOut) getAudioOut(inputs, gain, delay).then(setAudioOut);
  }, [audioOut, inputs, gain, delay]);

  return audioOut;
}
