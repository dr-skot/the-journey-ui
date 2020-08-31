import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { LocalVideoTrack } from 'twilio-video';

export function useLocalVideoTrack() {
  const [{ localTracks }, dispatch] = useContext(AppContext);
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  useEffect(() => {
    if (!videoTrack) dispatch('getLocalTracks');
  }, [videoTrack]);

  return videoTrack;
}


