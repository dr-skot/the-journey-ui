import { useEffect, useState } from 'react';
import { getAudioContext } from '../../utils/audio';

export default function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    if (!audioContext) getAudioContext().then(setAudioContext);
  }, [!audioContext]);

  return audioContext;
}
