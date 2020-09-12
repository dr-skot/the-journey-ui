import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import Facts from './Facts';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import { Button } from '@material-ui/core';
import Broadcast from '../Broadcast/Broadcast';
import { Floater } from '../Gallery/MinFocusGroup';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';

export default function MinEntry() {
  const [{ roomStatus }] = useContext(AppContext);
  const roomName = 'min';
  const [justFacts, setJustFacts] = useState(false);
  const [muted, setMuted] = useState(false);

  return roomStatus === 'connected'
    ? (
      <>
        <SubscribeToFocusGroupAudio/>
        { !muted && <PlayAllSubscribedAudio/>}
        { justFacts ? <Facts/> : <Broadcast type="millicast" /> }
        <Floater>
          <Button onClick={() => setJustFacts((prev) => !prev)} variant="contained" color="primary">
            {justFacts ? 'view' : 'facts'}
          </Button>
          <Button onClick={() => setMuted((prev) => !prev)} variant="contained">
            {muted ? 'unmute' : 'mute'}
          </Button>
        </Floater>
      </>
    )
    : <SignIn roomName={roomName} role="audience"/>;
}
