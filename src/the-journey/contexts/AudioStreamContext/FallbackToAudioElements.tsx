import { useContext } from 'react';
import { AudioStreamContext } from './AudioStreamContext';

export default function FallbackToAudioElements() {
  const { setFallback } = useContext(AudioStreamContext);
  setFallback(true);
  return null;
}
