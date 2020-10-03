import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { useEffect } from 'react';
import { publishTracks } from '../utils/twilio';

const getStoredDeviceIds = () => ({
  video: sessionStorage.getItem('videoDeviceId'),
  audio: sessionStorage.getItem('audioDeviceId'),
});

export function useLocalTracks() {
  const [{ room, localTracks }, dispatch] = useTwilioRoomContext();
  useEffect(() => {
    if (localTracks.length === 0) dispatch('getLocalTracks', { deviceIds: getStoredDeviceIds() })
  }, [localTracks]);
  useEffect(() => {
    if (room && room.localParticipant.tracks.size === 0 && localTracks.length !== 0) {
      publishTracks(room, localTracks);
    }
  }, [room, localTracks])
  return localTracks;
}

