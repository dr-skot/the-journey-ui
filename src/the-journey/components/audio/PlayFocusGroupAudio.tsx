import React from 'react';
import { difference } from 'lodash';
import { useAppState } from '../../contexts/AppStateContext';
import PlayAudioTracks from './PlayAudioTracks';
import { cached } from '../../utils/react-help';

export default function PlayFocusGroupAudio(props: { controlled?: boolean }) {
  const [{ focusGroup, mutedInFocusGroup }] = useAppState();

  let group = difference(focusGroup, mutedInFocusGroup);
  group = cached('FocusGroupAudio').ifEqual(group) as string[];

  return <PlayAudioTracks group={group} controlled={props.controlled}/>;
}
