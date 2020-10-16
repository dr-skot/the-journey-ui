import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';
import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { inGroup } from '../utils/twilio';
import { difference } from 'lodash';
import { cached } from '../utils/react-help';

export default function SubscribeToFocusGroupAudioMinusMutedMinusRoommates() {
  const [{ room }] = useTwilioRoomContext();
  const [{ focusGroup, mutedInFocusGroup, roommates }] = useAppState();
  if (!room) return null;

  const myRoommates = roommates.find((group) => inGroup(group)(room.localParticipant)) || [];

  let group = difference(focusGroup, mutedInFocusGroup);
  group = difference(group, myRoommates);
  group = cached('SubscribeToFocusGroupAudioMinusMutedMinusRoommates.group')
    .ifEqual(group) as string[];

  return <Subscribe profile="listen" focus={group}/>
}
