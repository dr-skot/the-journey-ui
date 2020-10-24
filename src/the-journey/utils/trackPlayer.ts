import { RemoteAudioTrack } from 'twilio-video';
import { difference } from 'lodash';
import { getAudioContext } from './audio';
import { constrain } from './functional';

export const MAX_INPUTS = 30;
export const MAX_DELAY_TIME = 10;
export const DEFAULT_GAIN = 0.8;
export const DEFAULT_DELAY = 0;

interface AudioOut {
  channelMergerNode: ChannelMergerNode,
  delayNode: DelayNode,
  gainNode: GainNode,
  audioElement: HTMLAudioElement,
}

interface AudioSource {
  node: AudioNode,
  stream: MediaStream,
}

let audioOut: AudioOut;
const sources: Record<string, AudioSource> = {};
let delayTime = DEFAULT_DELAY;
let gain = DEFAULT_GAIN;


export function playTracks(tracks: RemoteAudioTrack[]) {
  console.debug('play', tracks.length, 'tracks');
  const playing = Object.keys(sources);
  const playList = tracks.map((track) => track.sid);
  const killList = difference(playing, playList);
  const startList = difference(playList, playing);

  console.debug('lists', { playing, playList, killList, startList });

  killList.forEach((sid) => removeChannel(sid));
  startList.forEach((sid) => {
    const track = tracks.find((track) => track.sid === sid);
    if (track) addChannel(track);
  });
}

function addChannel(track: RemoteAudioTrack) {
  console.log('adding channel');
  getAudioContext().then((audioContext) => {
    // create a media stream source using the track
    const stream = new MediaStream([track.mediaStreamTrack.clone()])
    const node = audioContext.createMediaStreamSource(stream);
    console.debug('node created', node);

    node.connect(audioOut.channelMergerNode);
    sources[track.sid] = { node, stream };
  });
}

function removeChannel(sid: string) {
  console.log('removing channel');
  const source = sources[sid];
  if (!source) return;
  source.node.disconnect();
  source.stream.getTracks().forEach((track) => track.stop());
  delete sources[sid];
}

export const getGain = () => gain;
export const getDelayTime = () => delayTime;

export function setGain(value: number) {
  if (audioOut) audioOut.gainNode.gain.value = value;
}

export function setDelayTime(value: number) {
  if (audioOut) audioOut.delayNode.delayTime.value = value;
}


//
// Initialization
//

// initialize on first click or button press
document.addEventListener('click', initialize, { once: true });
document.addEventListener('keydown', initialize, { once: true });

function initialize() {
  if (!audioOut) getAudioContext().then(initializeAudioOut)
}

function initializeAudioOut(audioContext: AudioContext) {
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
    console.error('didnt play', error);
  })

  audioOut = {
    channelMergerNode,
    delayNode,
    gainNode,
    audioElement,
  };
}
