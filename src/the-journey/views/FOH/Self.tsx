import React, { useContext } from 'react';
import { AppContext, useAppContext } from '../../contexts/AppContext';
import Holding from './Holding';
import { RouteComponentProps } from 'react-router-dom';
import SignIn from './SignIn';
import { defaultRoom } from '../../utils/twilio';
import { Helmet } from 'react-helmet';
import { Button } from '@material-ui/core';


interface CodeParam {
  code?: string;
}

export default function Self({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  const lobby = `${code || defaultRoom()}-lobby`;

  return roomStatus === 'connected'
    ? <Thingy />
    : <SignIn roomName={lobby} role="foh"/>
}

function Thingy() {
  const [, dispatch] = useAppContext();

  return (
    <Button onClick={() => dispatch('joinRoom', {  role: 'audience', roomName: 'thingy' }) }>
      try it
    </Button>
  )
}
