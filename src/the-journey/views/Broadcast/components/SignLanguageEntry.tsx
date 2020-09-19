import React, { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { RouteComponentProps } from 'react-router-dom';
import { defaultRoom } from '../../../utils/twilio';
import Broadcast from '../Broadcast';
import SignIn from '../../FOH/SignIn';

interface CodeParam {
  code?: string;
}

export default function SignLanguageEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  return roomStatus === 'connected'
    ? <Broadcast />
    : <SignIn roomName={code || defaultRoom()} role="sign-interpreter"/>
}
