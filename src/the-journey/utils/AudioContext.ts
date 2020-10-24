import onNextGesture from './onNextGesture';

// @ts-ignore
window.AudioContext = window.AudioContext || window.webkitAudioContext || undefined;

export const AUDIO_CONTEXT_SUPPORTED = !!AudioContext;

let audioContext: AudioContext | undefined;
let contextAcquisitionReported = false;

export function getAudioContext() : Promise<AudioContext> {
  if (!AUDIO_CONTEXT_SUPPORTED) return Promise.reject(new Error('AudioContext not supported'));
  audioContext = audioContext || (AudioContext && new AudioContext());
  if (audioContext && !contextAcquisitionReported) {
    console.log('got AudioContext');
    contextAcquisitionReported = true;
  }
  if (audioContext) return Promise.resolve(audioContext);
  return new Promise((resolve) => {
    onNextGesture(() => getAudioContext().then(resolve));
  });
}
