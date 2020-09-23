import React, { useContext, useEffect } from 'react';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import { defaultRoom, insureHighPriorityVideo } from '../../../utils/twilio';
import Broadcast from '../StarBroadcast';
import SignIn from '../../FOH/SignIn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

export default function StarEntry() {
  const [{ room, roomStatus }] = useContext(TwilioRoomContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const code = match.params.code;

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
    : <SignIn roomName={code || defaultRoom()} role="star"/>
}
