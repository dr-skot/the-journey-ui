import { useContext, useEffect } from 'react';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import { difference } from 'lodash';

export default function FocusGroupAudio() {
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ focusGroup, mutedInFocusGroup }] = useContext(SharedRoomContext);
  const stars = useParticipants().filter(isRole('star')).map((p) => p.identity);

  let group = [...difference(focusGroup, mutedInFocusGroup), ...stars];
  group = cached('FocusGroupAudio').ifEqual(group) as string[];

  useEffect(() => setUnmutedGroup(group), [group, setUnmutedGroup]);

  return null;
}
