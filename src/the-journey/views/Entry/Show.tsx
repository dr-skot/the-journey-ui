import React, { useEffect } from 'react';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { tryToParse } from '../../utils/functional';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { useSharedRoomState } from '../../contexts/AppStateContext';
import SafeRedirect from '../../components/SafeRedirect';

const getSessionData = () => tryToParse(sessionStorage.getItem('roomJoined') || '') || {}

export default function Show() {
  const { identity } = getSessionData();
  return identity ? <ValidatedShow/> : <SafeRedirect to="/entry"/>
}

const ValidatedShow = () => {
  const [{ roomStatus }, dispatch] = useTwilioRoomContext();
  const [{ rejected }] = useSharedRoomState();
  const { meeting } = useMeeting();
  const { identity, roomName } = getSessionData();

  console.log('RENDER: ValidatedShow')

  // TODO deal with room.localParticipant.identity !== identity ?
  useEffect(() => {
    if (roomStatus === 'disconnected') dispatch('joinRoom', { identity, roomName })
  }, [roomStatus]);

  if (rejected.includes(identity)) return <SafeRedirect to="/rejected"/>

  return meeting ? <Meeting group={meeting}/> : <Broadcast/>;
}
