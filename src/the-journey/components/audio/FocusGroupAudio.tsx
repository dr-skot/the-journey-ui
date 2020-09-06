import { useContext, useEffect } from 'react';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';

export default function FocusGroupAudio() {
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ focusGroup }] = useContext(SharedRoomContext);
  const stars = useParticipants().filter(isRole('star')).map((p) => p.identity);

  useEffect(() => {
    setUnmutedGroup([...focusGroup, ...stars]);
  }, [focusGroup, stars, setUnmutedGroup]);

  return null;
}
