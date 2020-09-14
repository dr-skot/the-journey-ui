import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import Broadcast from '../Broadcast/Broadcast';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import WithFacts from './WithFacts';
import useMeetup from '../../hooks/useMeetup';
import Meetup from '../FOH/Meetup';

export default function MinEntry() {
  const [{ roomStatus }] = useContext(AppContext);
  const { meetup } = useMeetup();
  const roomName = 'min';

  return roomStatus === 'connected'
    ? (
      <>
        <PlayAllSubscribedAudio/>
        { meetup
          ? <Meetup group={meetup}/>
          : <WithFacts><Broadcast type="millicast"/></WithFacts>
        }
      </>
    )
    : <SignIn roomName={roomName} role="audience"/>;
}
