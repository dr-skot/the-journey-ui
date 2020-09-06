import { AudioOut, getAudioOut } from '../../utils/audio';
import { useState } from 'react';

export default function useAudioOut(inputs?: number, gain?: number, delay?: number) {
  const [audioOut, setAudioOut] = useState<AudioOut>();
  getAudioOut(inputs, gain, delay).then(setAudioOut);
  return audioOut;
}
