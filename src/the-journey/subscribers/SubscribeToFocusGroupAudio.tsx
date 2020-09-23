import React from 'react';
import { useRoomState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';

export default function SubscribeToFocusGroupAudio() {
  const [{ focusGroup }] = useRoomState();
  return <Subscribe profile="listen" focus={focusGroup}/>
}
