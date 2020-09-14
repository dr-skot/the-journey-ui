import { useContext, useEffect } from 'react';
import { SharedRoomStateContext } from '../../contexts/SharedRoomStateContext';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';

export default function FocusGroupAudio() {
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ focusGroup }] = useContext(SharedRoomStateContext);
  const stars = useParticipants().filter(isRole('star')).map((p) => p.identity);

  const group = cached('FocusGroupAudio').ifEqual([...focusGroup, ...stars]) as string[];

  useEffect(() => setUnmutedGroup(group), [group, setUnmutedGroup]);

  return null;
}
