import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { RouteComponentProps } from 'react-router-dom';
import { defaultRoom } from '../../utils/twilio';
import Broadcast from '../Broadcast/Broadcast';
import SelfView from '../Broadcast/components/SelfView';
import { styled } from '@material-ui/core';
import SignIn from '../FOH/SignIn';

const SignerWindow = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 60,
  right: 10,
  width: theme.sidebarWidth,
}));

interface CodeParam {
  code?: string;
}

export default function SignerEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  return roomStatus === 'connected'
    ? <><Broadcast /><SignerWindow><SelfView/></SignerWindow></>
    : <SignIn roomName={code || defaultRoom()} role="signer"/>
}
