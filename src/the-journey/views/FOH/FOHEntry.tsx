import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Holding from './Holding';
import { RouteComponentProps } from 'react-router-dom';
import SignIn from './SignIn';
import { defaultRoom } from '../../utils/twilio';


interface CodeParam {
  code?: string;
}

export default function FOHEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  return roomStatus === 'connected'
    ? <Holding />
    : <SignIn roomName={code || defaultRoom()} role="foh"/>
}
