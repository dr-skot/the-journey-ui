import React from 'react';
import { useSharedRoomState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';

export default function SubscribeToFocusGroupAudio() {
  const [{ focusGroup }] = useSharedRoomState();
  return <Subscribe profile="listen" focus={focusGroup}/>
}
