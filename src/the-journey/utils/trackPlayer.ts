import { RemoteAudioTrack } from 'twilio-video';
import { difference } from 'lodash';
import { getAudioOut } from './AudioOut';

interface AudioSource {
  node: AudioNode,
  stream: MediaStream,
}

const sources: Record<string, AudioSource> = {};

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
  if (!track?.mediaStreamTrack?.clone) return;
  getAudioOut().then((audioOut) => {
    // create a media stream source using the track
    const stream = new MediaStream([track.mediaStreamTrack.clone()])
    const node = audioOut.audioContext.createMediaStreamSource(stream);
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
