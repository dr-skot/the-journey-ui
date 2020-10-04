import React, { useContext } from 'react';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import Broadcast from '../Broadcast';
import SignIn from '../../FOH/SignIn';
import useRoomName from '../../../hooks/useRoomName';

export default function SignLanguageEntry() {
  const [{ roomStatus }] = useContext(TwilioRoomContext);
  const roomName = useRoomName();

  return roomStatus !== 'disconnected'
    ? <Broadcast />
    : <SignIn roomName={roomName} role="sign-interpreter"/>
}
