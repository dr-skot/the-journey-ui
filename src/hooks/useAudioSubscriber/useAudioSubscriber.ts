import { useEffect } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import { RemoteAudioTrack } from 'twilio-video';

type useAudioSubscriberProp = 'delayed' | undefined;

export default function useAudioSubscriber(delayed: useAudioSubscriberProp = undefined) {
  const { room } = useVideoContext();
  const { audioContext, audioDelay } = useAppState();
  const delayTime = delayed ? audioDelay || 20 : 0;

  console.log('useAudioSubscriber', delayed || 'not delayed');

  useEffect(() => {
    console.log('watching subscriptions');
    const playTrack = (track: RemoteAudioTrack) => {
      console.log('track subscribed', track.kind);
      if (track?.kind !== 'audio') return;
      console.log('create media stream source');
      const delayedTrack = audioContext.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
      console.log('create delay node');
      const delayNode = new DelayNode(audioContext, { delayTime });
      console.log('connect it all up');
      delayedTrack.connect(delayNode);
      delayNode.connect(audioContext.destination);
    }
    // TODO also clean up on disconnect
    room.on('trackSubscribed', playTrack)
    return () => { room.removeListener('trackSubscribed', playTrack); }
  }, [room]);

}
