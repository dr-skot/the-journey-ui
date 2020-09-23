import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useContext } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';

export default function useLocalAudioToggle() {
  const [{ localTracks }] = useContext(TwilioRoomContext);
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
