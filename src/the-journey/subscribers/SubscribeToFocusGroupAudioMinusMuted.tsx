import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';
import { difference } from 'lodash';
import { cached } from '../utils/react-help';

export default function SubscribeToFocusGroupAudioMinusMuted() {
  const [{ focusGroup, mutedInFocusGroup }] = useAppState();
  let group = difference(focusGroup, mutedInFocusGroup);
  group = cached('SubscribeToFocusGroupAudioMinusMuted.group').ifEqual(group) as string[];
  return <Subscribe profile="listen" focus={group}/>
}
