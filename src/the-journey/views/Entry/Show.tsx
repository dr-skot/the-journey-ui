import React, { useEffect } from 'react';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { tryToParse } from '../../utils/functional';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { useAppState } from '../../contexts/AppStateContext';
import SafeRedirect from '../../components/SafeRedirect';
import { useLocalTracks } from '../../hooks/useLocalTracks';

const getSessionData = () => tryToParse(sessionStorage.getItem('roomJoined') || '') || {}

export default function Show() {
  const { identity } = getSessionData();
  return identity ? <ValidatedShow/> : <SafeRedirect to="/entry"/>
}

const ValidatedShow = () => {
  const [{ roomStatus }, dispatch] = useTwilioRoomContext();
  const [{ rejected }, appStateDispatch] = useAppState();
  const { meeting } = useMeeting();
  const { identity, roomName } = getSessionData();
  const localTracks = useLocalTracks();

  console.log('RENDER: ValidatedShow');
  console.log('localTracks', localTracks);

  // when you're here, you're ready; when you're not, you're not
  useEffect(() => {
    appStateDispatch('setMembership', { group: 'notReady', value: false });
    return () => {
      appStateDispatch('setMembership', { group: 'notReady', value: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (roomStatus === 'disconnected' && localTracks.length > 0) {
      dispatch('joinRoom', { identity, roomName })
    }
  }, [roomStatus, localTracks, identity, roomName, dispatch]);

  if (rejected.includes(identity)) return <SafeRedirect to="/rejected"/>

  return meeting ? <Meeting group={meeting}/> : <Broadcast/>;
}
