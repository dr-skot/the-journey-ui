import React, { useEffect } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { isStaffed } from '../../utils/twilio';
import GetMedia from './GetMedia';
import NameForm from './NameForm';
import useRoomName from '../../hooks/useRoomName';
import { Messages } from '../../messaging/messages';

type MediaStatus = 'pending' | 'ready' | 'help-needed'

export default function Entry({ test }: { test?: boolean }) {
  const [{ room, roomStatus }, dispatch] = useTwilioRoomContext();
  const roomName = useRoomName() + (test ? '-test' : '');

  // get default media
  useEffect(() => dispatch('getLocalTracks'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!room || roomStatus === 'disconnected') return <NameForm roomName={roomName}/>

  const { identity } = room.localParticipant;
  sessionStorage.setItem('roomJoined', JSON.stringify({ identity, roomName }))

  if (!test && !isStaffed(room)) return Messages.UNSTAFFED_ROOM;

  return <GetMedia test={test}/>
}
