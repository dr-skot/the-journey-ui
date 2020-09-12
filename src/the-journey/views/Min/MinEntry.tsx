import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import Broadcast from '../Broadcast/Broadcast';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import WithFacts from './WithFacts';

export default function MinEntry() {
  const [{ roomStatus }] = useContext(AppContext);
  const roomName = 'min';

  return roomStatus === 'connected'
    ? (
      <>
        <SubscribeToFocusGroupAudio/>
        <PlayAllSubscribedAudio/>
        <WithFacts>
          <Broadcast type="millicast" />
        </WithFacts>
      </>
    )
    : <SignIn roomName={roomName} role="audience"/>;
}
