import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { RouteComponentProps } from 'react-router-dom';
import { defaultRoom } from '../../../utils/twilio';
import Broadcast from '../Broadcast';
import SignIn from '../../FOH/SignIn';

interface CodeParam {
  code?: string;
}

export default function StarEntry({ match }: RouteComponentProps<CodeParam>) {
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const code = match.params.code;

  // remove audio bitrate limitation
  useEffect(() => {
    dispatch('changeSetting', { name: 'maxAudioBitrate', value: 'default' });
  }, [])

  return roomStatus === 'connected'
    ? <Broadcast type="pure" />
    : <SignIn roomName={code || defaultRoom()} role="star"/>
}
