import React, { useContext } from 'react';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import { RouteComponentProps } from 'react-router-dom';
import { defaultRoom } from '../../../utils/twilio';
import Broadcast from '../Broadcast';
import SignIn from '../../FOH/SignIn';

interface CodeParam {
  code?: string;
}

export default function SignLanguageEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(TwilioRoomContext);
  const code = match.params.code;

  return roomStatus !== 'disconnected'
    ? <Broadcast />
    : <SignIn roomName={code || defaultRoom()} role="sign-interpreter"/>
}
