import React, { useState } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { checkForOperator } from '../../utils/twilio';
import NameForm from './NameForm';
import useRoomName from '../../hooks/useRoomName';
import { Messages } from '../../messaging/messages';
import CenteredInWindow from '../../components/CenteredInWindow';
import { CircularProgress } from '@material-ui/core';
import SafeRedirect from '../../components/SafeRedirect';
import Broadcast from '../Broadcast/Broadcast';

type RoomCheck = 'checking' | 'good' | 'empty';

export default function LurkEntry() {
  const [roomCheck, setRoomCheck] = useState<RoomCheck>('checking');
  const roomName = useRoomName();

  console.debug('HEY ITS LURKENTRY');

  // check for unstaffed room
  checkForOperator(roomName)
    .then((hasOperator) => setRoomCheck(hasOperator ? 'good' : 'empty'))
    .catch((error) => {
      // TODO: disallow entry on error?
      console.log('error checking room', error);
      setRoomCheck('good'); // don't reject just because the checker's broken
    })

  switch (roomCheck) {
    case 'checking':
      return <CenteredInWindow><CircularProgress/></CenteredInWindow>;
    case 'good':
      return <StaffedRoomEntry/>
    case 'empty':
      return Messages.UNSTAFFED_ROOM;
  }
}

function StaffedRoomEntry() {
  const [{ room, roomStatus }] = useTwilioRoomContext();
  const roomName = useRoomName();

  if (!room || roomStatus === 'disconnected') return <NameForm roomName={roomName} role="lurker"/>

  const { identity } = room.localParticipant;
  sessionStorage.setItem('roomJoined', JSON.stringify({ identity, roomName }))

  return <Broadcast/>
}
