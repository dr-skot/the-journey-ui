// TODO this should sit in some sort of context, this is AppState stuff maybe in app state?
import { useEffect, useState } from 'react';
import { RemoteDataTrack } from 'twilio-video';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import useSubscriber from '../hooks/useSubscriber/useSubscriber';
import { useAppState } from './index';

export default function useDataTrackListener() {
  const { room } = useVideoContext();
  const { setAudioDelay } = useAppState();
  const subscribe = useSubscriber();
  const [focusGroup, setFocusGroup] = useState<string[]>([]);

  useEffect(() => {
    const tracks: RemoteDataTrack[] = [];
    const messageListener = (data: string) => {
      console.log(data);
      const message = JSON.parse(data);
      if (message.focus) setFocusGroup(message.focus);
      if (message.audioDelay) setAudioDelay(message.audioDelay);
    }
    const setMessageListener = (track: RemoteDataTrack) => {
      if (track.kind === 'data') {
        console.log('subscribed to data track!');
        tracks.push(track);
        track.on('message', messageListener);
      }
    };
    console.log('setting track subscribed listener');
    room.on('trackSubscribed', setMessageListener);
    return () => {
      console.log('removing listener');
      room.removeListener('trackSubscribed', setMessageListener);
      tracks.forEach((track) => track.removeListener('message', messageListener));
    }
  }, [room, subscribe]);

  return { focusGroup };
}
