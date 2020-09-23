import React, { useContext } from 'react';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import { defaultRoom } from '../../../utils/twilio';
import Broadcast from '../StarBroadcast';
import SignIn from '../../FOH/SignIn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

export default function StarEntry() {
  const [{ roomStatus }] = useContext(TwilioRoomContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const code = match.params.code;

  return roomStatus === 'connected'
    ? <Broadcast />
    : <SignIn roomName={code || defaultRoom()} role="star"/>
}
