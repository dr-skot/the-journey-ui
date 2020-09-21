import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import { defaultRoom, inGroup } from '../../utils/twilio';
import RoomJoinForm from './RoomJoinForm';
import { DeviceSelector } from '../../components/MenuBar/DeviceSelector/DeviceSelector';

function rejectedPath() {
  return window.location.pathname.replace('entry', 'rejected');
}

interface EntryProps {
  roomName?: string;
}
export default function Entry({ roomName = defaultRoom() }: EntryProps) {
  const [{ room, localTracks, roomStatus }] = useAppContext();
  const [{ rejected }] = useSharedRoomState();
  const { meeting } = useMeeting();
  const helpNeeders: string[] = [];

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to={rejectedPath()} />;

  if (!room) return <RoomJoinForm roomName={roomName}/>
  console.log('got past room check');
  if (!localTracks.length && !inGroup(helpNeeders)(room.localParticipant)) return <GetMedia />

  return roomStatus !== 'disconnected'
    ? meeting
      ? <Meeting group={meeting}/>
      : <Broadcast type="millicast" />
    : <SignIn roomName={roomName} role="audience"/>;
}

function GetMedia() {
  console.log('get media!');
  return <>
    <h1>get media</h1>
    <DeviceSelector/>
  </>
}
