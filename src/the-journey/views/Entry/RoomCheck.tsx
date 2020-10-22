import React, { ReactElement } from 'react';
import useRoomName from '../../hooks/useRoomName';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import useParticipantList from '../../hooks/useParticipants/useParticipantList';
import CenteredInWindow from '../../components/CenteredInWindow';
import { CircularProgress } from '@material-ui/core';
import { Messages } from '../../messaging/messages';

const MAX_PARTICIPANTS = 3;
const RETRY_INTERVAL = 3000;

interface RoomCheckProps {
  children: ReactElement,
}

export default function RoomCheck({ children }: RoomCheckProps) {
  const roomName = useRoomName();
  const [{ roomStatus }] = useTwilioRoomContext();
  const participantList = useParticipantList(roomName, RETRY_INTERVAL);

  const roomHasOperator = participantList && participantList.some((p) => (
    p.identity.match(/^operator\|operator\|/)
  ));

  const roomIsFull = roomStatus === 'disconnected' && MAX_PARTICIPANTS <= (participantList?.length || 0);

  if (!participantList) return <CenteredInWindow><CircularProgress/></CenteredInWindow>;
  if (roomIsFull) return Messages.FULL_THEATER;
  if (!roomHasOperator) return Messages.UNSTAFFED_ROOM;
  return children;
}
