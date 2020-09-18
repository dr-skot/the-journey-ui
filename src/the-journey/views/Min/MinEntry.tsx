import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import { inGroup } from '../../utils/twilio';
import { DEFAULT_ROOM_NAME } from '../../../App';

interface MinEntryProps {
  roomName?: string;
}

export default function MinEntry({ roomName = DEFAULT_ROOM_NAME }: MinEntryProps) {
  const [{ room, roomStatus }] = useAppContext();
  const [{ rejected }] = useSharedRoomState();
  const { meeting } = useMeeting();

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to="/rejected" />;

  return roomStatus === 'connected'
    ? meeting
      ? <Meeting group={meeting}/>
      : <Broadcast type="millicast" />
    : <SignIn roomName={roomName} role="audience"/>;
}
