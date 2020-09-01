// @ts-ignore
window.AudioContext = window.AudioContext || window.webkitAudioContext || undefined;

export const AUDIO_CONTEXT_SUPPORTED = !!AudioContext;

export function getAudioContext() : Promise<AudioContext> {
  if (!AUDIO_CONTEXT_SUPPORTED) return Promise.reject(new Error('AudioContext not supported'));
  const context = AudioContext && new AudioContext();
  if (context) return Promise.resolve(context);
  return new Promise((resolve) => {
    document.addEventListener('click', () => getAudioContext().then(resolve), { once: true });
    document.addEventListener('keydown', () => getAudioContext().then(resolve), { once: true });
  });
}

export interface AudioOut {
  outputNode: ChannelMergerNode,
  delayNode: DelayNode,
  gainNode: GainNode,
  audioContext: AudioContext,
}

// a node with delay and gain settings you can pipe lots of sources to
// set up mergerNode -> delayNode -> gainNode -> destination (then you connect everything to the merger node)
export function getAudioOut(inputs = 10, gain = 1, delay = 0): Promise<AudioOut> {
  return getAudioContext().then((context: AudioContext) => {
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(gain, context.currentTime);
    const delayNode = context.createDelay(20);
    delayNode.delayTime.setValueAtTime(delay, context.currentTime);
    const mergerNode = context.createChannelMerger(inputs);
    mergerNode.connect(delayNode);
    delayNode.connect(gainNode);
    gainNode.connect(context.destination);
    return { delayNode, gainNode, outputNode: mergerNode, audioContext: context };
  });
}

export function setGain(gain: number, audioOut?: AudioOut) {
  console.log('I want to set gain to', gain, 'good thing theres an audioout:', audioOut);
  if (!audioOut) return 1; // didn't work, so gain is 1
  const { gainNode, audioContext } = audioOut;
  console.log('setting gain to', gain);
  gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
  return gain;
}

export function setDelay(delay: number, audioOut?: AudioOut) {
  console.log('I want to set delay to', delay, 'good thing theres an audioout:', audioOut);
  if (!audioOut) return 0; // didn't work, so delay is 0
  const { delayNode, audioContext } = audioOut;
  console.log('setting delay to', delay);
  delayNode.delayTime.setValueAtTime(delay, audioContext.currentTime);
  return delay;
}
