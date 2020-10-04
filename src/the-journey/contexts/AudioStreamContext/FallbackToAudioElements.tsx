import { useContext, useEffect } from 'react';
import { AudioStreamContext } from './AudioStreamContext';

export default function FallbackToAudioElements() {
  const { setFallback } = useContext(AudioStreamContext);
  useEffect(() => setFallback(true), [setFallback]);
  return null;
}
