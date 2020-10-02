import React, { useContext, useEffect } from 'react';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import { insureHighPriorityVideo } from '../../../utils/twilio';
import Broadcast from './StarBroadcast';
import SignIn from '../../FOH/SignIn';
import useRoomName from '../../../hooks/useRoomName';

export default function StarEntry() {
  const [{ room, roomStatus }] = useContext(TwilioRoomContext);
  const roomName = useRoomName();

  useEffect(() => {
    if (!room) return;
    function insureHighPriority() {
      if (room) insureHighPriorityVideo(room.localParticipant);
    }
    room.on('trackPublished', insureHighPriority);
    return () => { room.off('trackUnpublished', insureHighPriority) }
  }, [room])

  return roomStatus !== 'disconnected'
    ? <Broadcast />
    : <SignIn roomName={roomName} role="star"/>
}
