import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';
import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { inGroup } from '../utils/twilio';
import { difference } from 'lodash';

export default function SubscribeToFocusGroupAudioMinusRoommates() {
  const [{ room }] = useTwilioRoomContext();
  const [{ focusGroup, roommates }] = useAppState();
  if (!room) return null;
  const myRoommates = roommates.find((group) => inGroup(group)(room.localParticipant)) || [];
  return <Subscribe profile="listen" focus={difference(focusGroup, myRoommates)}/>
}
