import { RemoteAudioTrack } from 'twilio-video';
import { difference } from 'lodash';
import { DEFAULT_DELAY, DEFAULT_GAIN } from '../contexts/AudioStreamContext/AudioStreamContext';
import { getAudioContext } from './audio';

const MAX_DELAY_TIME = 10;
let delayTime = DEFAULT_DELAY;
let gain = DEFAULT_GAIN;

interface TrackPlayer {
  stream: MediaStream,
  delayNode: DelayNode,
  gainNode: GainNode,
  audioElement: HTMLAudioElement,
}

const players: Record<string, TrackPlayer> = {};

export function playTracks(tracks: RemoteAudioTrack[]) {
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
    audioElement.autoplay = true;
    console.debug('attached to audio', audioElement);

    // add audio element to document
    document.body.appendChild(audioElement);
    console.log('added to document');

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

export function setGain(value: number) {
  gain = value;
  Object.values(players).forEach((player) => {
    player.gainNode.gain.value = value;
  });
}

export function setDelayTime(value: number) {
  delayTime = value;
  Object.values(players).forEach((player) => {
    player.delayNode.delayTime.value = value;
  });
}
