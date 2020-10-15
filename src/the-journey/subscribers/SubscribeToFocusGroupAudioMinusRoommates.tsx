import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';
import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { inGroup } from '../utils/twilio';
import { difference } from 'lodash';
import { cached } from '../utils/react-help';

export default function SubscribeToFocusGroupAudioMinusRoommates() {
  const [{ room }] = useTwilioRoomContext();
  const [{ focusGroup, roommates }] = useAppState();
  if (!room) return null;

  const myRoommates = roommates.find((group) => inGroup(group)(room.localParticipant)) || [];

  const group = cached('FocusGroupMinusRoommates.group')
    .ifEqual(difference(focusGroup, myRoommates)) as string[];

  return <Subscribe profile="listen" focus={group}/>
}
