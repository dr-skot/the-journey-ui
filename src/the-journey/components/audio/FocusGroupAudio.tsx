import { useContext, useEffect } from 'react';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { cached } from '../../utils/react-help';
import { difference } from 'lodash';

export default function FocusGroupAudio() {
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ focusGroup, mutedInFocusGroup }] = useContext(SharedRoomContext);

  let group = difference(focusGroup, mutedInFocusGroup);
  group = cached('FocusGroupAudio').ifEqual(group) as string[];

  useEffect(() => setUnmutedGroup(group), [group, setUnmutedGroup]);

  return null;
}
