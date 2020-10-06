import React, { useState } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { checkForOperator } from '../../utils/twilio';
import GetMedia from './GetMedia';
import NameForm from './NameForm';
import useRoomName from '../../hooks/useRoomName';
import { Messages } from '../../messaging/messages';
import { useLocalTracks } from '../../hooks/useLocalTracks';
import CenteredInWindow from '../../components/CenteredInWindow';
import { CircularProgress } from '@material-ui/core';

type RoomCheck = 'checking' | 'good' | 'empty';

export default function Entry({ test }: { test?: boolean }) {
  const [roomCheck, setRoomCheck] = useState<RoomCheck>('checking');
  const roomName = useRoomName();

  if (test) return <StaffedRoomEntry test/>;

  // check for unstaffed room
  checkForOperator(roomName)
    .then((hasOperator) => setRoomCheck(hasOperator ? 'good' : 'empty'))
    .catch((error) => {
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

function StaffedRoomEntry({ test }: { test?: boolean }) {
  const [{ room, roomStatus }] = useTwilioRoomContext();
  const roomName = useRoomName() + (test ? '-test' : '');

  // it would make more sense to delay this until the GetMedia view, but
  // when I move it there some iPads fail to acquire the microphone
  useLocalTracks();

  if (!room || roomStatus === 'disconnected') return <NameForm roomName={roomName}/>

  const { identity } = room.localParticipant;
  sessionStorage.setItem('roomJoined', JSON.stringify({ identity, roomName }))

  return <GetMedia test={test}/>
}
