import { useState } from 'react';
import { getAudioContext } from '../../utils/audio';

export default function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  getAudioContext().then(setAudioContext);
  return audioContext;
}
