import { useContext, useEffect } from 'react';
import { AudioStreamContext } from '../../contexts/AudioStreamContext';
import { cached } from '../../utils/react-help';
import { difference } from 'lodash';
import { useAppState } from '../../contexts/AppStateContext';

export default function FocusGroupAudio() {
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ focusGroup, mutedInFocusGroup }] = useAppState();

  let group = difference(focusGroup, mutedInFocusGroup);
  group = cached('FocusGroupAudio').ifEqual(group) as string[];

  useEffect(() => setUnmutedGroup(group), [group, setUnmutedGroup]);

  return null;
}
