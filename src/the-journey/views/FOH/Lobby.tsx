import Broadcast, { BroadcastType } from '../Broadcast/Broadcast';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { Redirect } from 'react-router-dom';
import Holding from './Holding';

interface LobbyProps {
  broadcastType: BroadcastType,
}

export default function Lobby({ broadcastType }: LobbyProps) {
  const [{ room }] = useContext(AppContext);
  const [{ admitted, rejected }] = useContext(SharedRoomContext);
  const { identity } = room?.localParticipant || {};
  return (!identity || rejected.includes(identity)) ? <Redirect to="/rejected" />
    : admitted.includes(identity) ? <Broadcast type={broadcastType} />
      : <Holding />;
}
