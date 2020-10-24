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

let delayTime = DEFAULT_DELAY;
let gain = DEFAULT_GAIN;

let audioOut: AudioOut;

interface TrackPlayer {
  stream: MediaStream,
  delayNode: DelayNode,
  gainNode: GainNode,
  audioElement: HTMLAudioElement,
}

interface AudioSource {
  node: AudioNode,
  stream: MediaStream,
}

const players: Record<string, TrackPlayer> = {};
const sources: Record<string, AudioSource> = {};

function initializeAudioOut(audioContext: AudioContext) {
  console.debug('initializing audio out');
  const channelMergerNode = getChannelMergerNode(audioContext);
  const delayNode = getDelayNode(audioContext);
  const gainNode = getGainNode(audioContext);
  const destination = audioContext.createMediaStreamDestination();
  const audioElement = document.createElement('audio');

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


export function playTracksOld(tracks: RemoteAudioTrack[]) {
  const playing = Object.keys(players);
  const playList = tracks.map((track) => track.sid);
  const killList = difference(playing, playList);
  const startList = difference(playList, playing);

  killList.forEach((sid) => killPlayer(sid));
  startList.forEach((sid) => {
    const track = tracks.find((track) => track.sid === sid);
    if (track) addPlayer(track);
  });
}

function addPlayer(track: RemoteAudioTrack) {
  getAudioContext().then((audioContext) => {
    // create a media stream source using the track
    const stream = new MediaStream([track.mediaStreamTrack.clone()])
    const node = audioContext.createMediaStreamSource(stream);
    console.debug('node created', node);

    // create a media stream destination in the audio context
    const destination = audioContext.createMediaStreamDestination();
    const gainNode = getGainNode(audioContext);
    const delayNode = getDelayNode(audioContext);

    node.connect(gainNode);
    gainNode.connect(delayNode);
    delayNode.connect(destination);

    // set the destination's MediaStream as the audio element's srcObject
    const audioElement = document.createElement('audio');
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

    players[track.sid] = { stream, delayNode, gainNode, audioElement };
  });
}

function killPlayer(sid: string) {
  const player = players[sid];
  player.stream.getTracks().forEach((track) => track.stop());
  player.audioElement.srcObject = null;
  player.audioElement.remove();
  delete players[sid];
}

function getChannelMergerNode(audioContext: AudioContext) {
  return audioContext.createChannelMerger(MAX_INPUTS);
}

function getDelayNode(audioContext: AudioContext) {
  const delayNode = audioContext.createDelay(MAX_DELAY_TIME);
  delayNode.delayTime.value = delayTime;
  return delayNode;
}

function getGainNode(audioContext: AudioContext) {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;
  return gainNode;
}

export const getGain = () => gain;
export const getDelayTime = () => delayTime;

export function setGain(value: number) {
  gain = constrain(0, 1)(value);
  Object.values(players).forEach((player) => {
    player.gainNode.gain.value = value;
  });
}

export function setDelayTime(value: number) {
  delayTime = constrain(0, MAX_DELAY_TIME)(value);
  Object.values(players).forEach((player) => {
    player.delayNode.delayTime.value = value;
  });
}


// initialize on first click or button press
function initialize() {
  if (!audioOut) getAudioContext().then(initializeAudioOut);
}
document.addEventListener('click', initialize, { once: true });
document.addEventListener('keydown', initialize, { once: true });
