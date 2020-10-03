import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';

export default function SubscribeToFocusGroupAudio() {
  const [{ focusGroup }] = useAppState();
  return <Subscribe profile="listen" focus={focusGroup}/>
}
