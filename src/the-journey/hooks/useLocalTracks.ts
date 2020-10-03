import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { useEffect } from 'react';
import { publishTracks } from '../utils/twilio';
import { removeUndefineds } from '../../twilio/utils';

const getStoredDeviceIds = () => ({
  video: sessionStorage.getItem('videoDeviceId') || undefined,
  audio: sessionStorage.getItem('audioDeviceId') || undefined,
});

export function useLocalTracks() {
  const [{ room, localTracks }, dispatch] = useTwilioRoomContext();
  const deviceIds = removeUndefineds(getStoredDeviceIds());
  console.log('useLocalTracks', { localTracks, deviceIds });

  useEffect(() => {
    if (localTracks.length === 0) dispatch('getLocalTracks', { deviceIds: deviceIds })
  }, [localTracks]);

  useEffect(() => {
    if (room && room.localParticipant.tracks.size === 0 && localTracks.length !== 0) {
      publishTracks(room, localTracks);
    }
  }, [room, localTracks])
  return localTracks;
}

