import { RemoteAudioTrack } from 'twilio-video';
import { difference } from 'lodash';
import { getAudioOut } from './AudioOut';

interface AudioSource {
  node: AudioNode,
  stream: MediaStream,
}

const sources: Record<string, AudioSource> = {};

export function playTracks(tracks: RemoteAudioTrack[]) {
  console.debug('trackPlayer: playing', tracks.length, 'tracks');
  const playing = Object.keys(sources);
  const playList = tracks.map((track) => track.sid);
  const killList = difference(playing, playList);
  const startList = difference(playList, playing);

  killList.forEach((sid) => removeChannel(sid));
  startList.forEach((sid) => {
    const track = tracks.find((track) => track.sid === sid);
    if (track) addChannel(track);
  });
}

function addChannel(track: RemoteAudioTrack) {
  if (!track?.mediaStreamTrack?.clone) return;
  getAudioOut().then((audioOut) => {
    const stream = new MediaStream([track.mediaStreamTrack.clone()])
    const node = audioOut.audioContext.createMediaStreamSource(stream);
    console.debug('trackPlayer: connecting node', { sid: track.sid, node });
    node.connect(audioOut.channelMergerNode);
    sources[track.sid] = { node, stream };
  });
}

function removeChannel(sid: string) {
  const source = sources[sid];
  if (!source) return;
  console.debug('trackPlayer: disconnecting node', { sid, node: source.node });
  source.node.disconnect();
  source.stream.getTracks().forEach((track) => track.stop());
  delete sources[sid];
}
