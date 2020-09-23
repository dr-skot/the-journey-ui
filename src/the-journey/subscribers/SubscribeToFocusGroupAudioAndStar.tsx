import React from 'react';
import { useRoomState } from '../contexts/AppStateContext';
import Subscribe from './Subscribe';
import useParticipants from '../hooks/useParticipants/useParticipants';
import { getIdentities, isRole } from '../utils/twilio';

export default function SubscribeToFocusGroupAudioAndStar() {
  const [{ focusGroup }] = useRoomState();
  const stars = getIdentities(useParticipants().filter(isRole('star')));

  return <Subscribe profile="listen" focus={focusGroup} stars={stars}/>
}
