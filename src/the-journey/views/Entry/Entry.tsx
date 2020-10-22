import React from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import GetMedia from './GetMedia';
import NameForm from './NameForm';
import useRoomName from '../../hooks/useRoomName';
import { useLocalTracks } from '../../hooks/useLocalTracks';
import RoomCheck from './RoomCheck';

export default function Entry({ test }: { test?: boolean }) {
  return test
    ? <RoomEntry test/>
    : <RoomCheck><RoomEntry/></RoomCheck>;
}


function RoomEntry({ test }: { test?: boolean }) {
  const [{ room, roomStatus }] = useTwilioRoomContext();
  const roomName = useRoomName() + (test ? '-test' : '');

  // it would make more sense to delay this until the GetMedia view, but
  // when I move it there some iPads fail to acquire the microphone
  useLocalTracks();

  if (!room || roomStatus === 'disconnected') return <NameForm roomName={roomName}/>

  console.debug('SAVING IDENTITY');
  const { identity } = room.localParticipant;
  sessionStorage.setItem('roomJoined', JSON.stringify({ identity, roomName }))

  return <GetMedia test={test}/>
}
