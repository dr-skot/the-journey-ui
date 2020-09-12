import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Holding from './Holding';
import { RouteComponentProps } from 'react-router-dom';
import SignIn from './SignIn';
import { defaultRoom } from '../../utils/twilio';
import { Helmet } from 'react-helmet';


interface CodeParam {
  code?: string;
}

export default function FOHEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  const lobby = `${code || defaultRoom()}`;

  return roomStatus === 'connected'
    ? <Holding />
    : <SignIn roomName={lobby} role="foh"/>
}
