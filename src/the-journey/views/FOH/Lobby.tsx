import Broadcast, { BroadcastType } from '../Broadcast/Broadcast';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { SharedRoomStateContext } from '../../contexts/SharedRoomStateContext';
import { Redirect } from 'react-router-dom';
import Holding from './Holding';
import { inGroup } from '../../utils/twilio';

interface LobbyProps {
  broadcastType: BroadcastType,
}

export default function Lobby({ broadcastType }: LobbyProps) {
  const [{ room }] = useContext(AppContext);
  const [{ admitted, rejected }] = useContext(SharedRoomStateContext);
  const me = room?.localParticipant;
  return !me || inGroup(rejected)(me) ? <Redirect to="/rejected" />
    : inGroup(admitted)(me) ? <Broadcast type={broadcastType} />
      : <Holding />;
}
