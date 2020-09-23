import { useContext, useEffect } from 'react';
import { TwilioRoomContext } from '../contexts/TwilioRoomContext';
import { LocalVideoTrack } from 'twilio-video';

export function useLocalVideoTrack() {
  const [{ localTracks }, dispatch] = useContext(TwilioRoomContext);
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  useEffect(() => {
    if (!videoTrack) dispatch('getLocalTracks');
  }, [videoTrack, dispatch]);

  return videoTrack;
}


