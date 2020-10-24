import { getAudioContext } from './AudioContext';
import onNextGesture from './onNextGesture';

export const MAX_INPUTS = 30;
export const MAX_DELAY_TIME = 10;
export const DEFAULT_GAIN = 0.8;
export const DEFAULT_DELAY = 0;

interface AudioOut {
  audioContext: AudioContext,
  channelMergerNode: ChannelMergerNode,
  delayNode: DelayNode,
  gainNode: GainNode,
  audioElement: HTMLAudioElement,
}

let audioOut: AudioOut;
let delayTime = DEFAULT_DELAY;
let gain = DEFAULT_GAIN;

export const getGain = () => gain;
export const getDelayTime = () => delayTime;

export function setGain(value: number) {
  gain = value;
  getAudioOut().then((audioOut) => {
    audioOut.gainNode.gain.value = value
  });
}

export function setDelayTime(value: number) {
  delayTime = value;
  getAudioOut().then((audioOut) => {
    audioOut.delayNode.delayTime.value = value;
  });
}

// get audioOut, either now or on next user gesture
export function getAudioOut(): Promise<AudioOut> {
  return audioOut
    ? Promise.resolve(audioOut)
    : new Promise((resolve) => {
        onNextGesture(() => {
          getAudioContext().then((audioContext) => {
          resolve(initializeAudioOut(audioContext));
        });
      });
  });
}

function initializeAudioOut(audioContext: AudioContext) {
  if (audioOut) return audioOut;
  console.debug('initializing audio out');
  const channelMergerNode = audioContext.createChannelMerger(MAX_INPUTS);
  const delayNode = audioContext.createDelay(MAX_DELAY_TIME);
  const gainNode = audioContext.createGain();
  const destination = audioContext.createMediaStreamDestination();
  const audioElement = document.createElement('audio');

  delayNode.delayTime.value = delayTime;
  gainNode.gain.value = gain;

  channelMergerNode.connect(delayNode).connect(gainNode).connect(destination);

  audioElement.srcObject = destination.stream;
  // audioElement.autoplay = true;
  console.debug('attached to audio', audioElement);

  // add audio element to document
  document.body.appendChild(audioElement);
  console.log('added to document');

  audioElement.play().then(() => {
    console.debug('audio element playing');
  }).catch((error) => {
    console.error('didn’t play', error);
  })

  audioOut = {
    audioContext,
    channelMergerNode,
    delayNode,
    gainNode,
    audioElement,
  };

  return audioOut;
}
