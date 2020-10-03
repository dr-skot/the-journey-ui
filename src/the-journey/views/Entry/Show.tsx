import React, { useEffect } from 'react';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { tryToParse } from '../../utils/functional';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { useSharedRoomState } from '../../contexts/AppStateContext';
import SafeRedirect from '../../components/SafeRedirect';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../../constants';
import { removeUndefineds } from '../../../twilio/utils';
import { publishTracks } from '../../utils/twilio';
import { useLocalTracks } from '../../hooks/useLocalTracks';

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
  const localTracks = useLocalTracks();

  console.log('RENDER: ValidatedShow');
  console.log('localTracks', localTracks);

  useEffect(() => {
    if (roomStatus === 'disconnected' && localTracks.length > 0) {
      dispatch('joinRoom', { identity, roomName })
    }
  }, [roomStatus, localTracks, identity, roomName, dispatch]);

  if (rejected.includes(identity)) return <SafeRedirect to="/rejected"/>

  return meeting ? <Meeting group={meeting}/> : <Broadcast/>;
}
