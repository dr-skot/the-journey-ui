import { useCallback, useEffect, useState } from 'react';
import { omit } from 'lodash';
import { RemoteAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';

function applyDelay(audioContext: AudioContext, streamSource: MediaStreamAudioSourceNode, delayTime: number) {
  streamSource.disconnect(); // TODO is this necessary?
  const delayNode = audioContext.createDelay(10);
  delayNode.delayTime.value = delayTime;
  streamSource.connect(delayNode).connect(audioContext.destination);
  return streamSource
}

export default function useDelayedStreamSources() {
  const { audioContext, audioDelay } = useAppState();
  const [streamSources, setStreamSources] = useState<Record<string, MediaStreamAudioSourceNode>>({});

  const addTrack = useCallback((track: RemoteAudioTrack) => {
    console.log('delayed stream source add track')
    if (track.kind !== 'audio') return;
    if (streamSources[track.sid]) return;
    console.log('creating streamSource for track', track);
    const streamSource = audioContext.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
    applyDelay(audioContext, streamSource, audioDelay);
    setStreamSources(prevStreamSources => ({ ...prevStreamSources, [track.sid]: streamSource }));
  }, [streamSources]);

  const removeTrack = useCallback((track: RemoteAudioTrack) => {
    console.log('delayed stream source remove track')
    if (track.kind !== 'audio') return;
    console.log('removing streamSource for track');
    const streamSource = streamSources[track.sid];
    if (!streamSource) return;
    streamSource.disconnect();
    setStreamSources(prevStreamSources => omit(prevStreamSources, [track.sid]));
  }, [streamSources]);

  useEffect(() => {
    console.log(`setting delay ${audioDelay} on all stream sources`);
    Object.values(streamSources).forEach((streamSource) => {
      if (streamSource) applyDelay(audioContext, streamSource, audioDelay);
    });
  }, [streamSources, audioDelay]);

  return { addTrack, removeTrack };
}