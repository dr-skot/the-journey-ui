import React, { useCallback, useEffect, useState } from 'react';
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
import { Button } from '@material-ui/core';

function rejectedPath() {
  return window.location.pathname.replace('entry', 'rejected');
}

type MediaStatus = 'pending' | 'ready' | 'help-needed'

interface EntryProps {
  roomName?: string;
}
export default function Entry({ roomName = defaultRoom() }: EntryProps) {
  const [{ room, roomStatus }, dispatch] = useAppContext();
  const [mediaStatus, setMediaStatus] = useState<MediaStatus>('pending');
  const [{ rejected, helpNeeded }, changeSharedState] = useSharedRoomState();
  const { meeting } = useMeeting();

  console.log('!!!helpNeeded', helpNeeded);

  const onNeedHelp = useCallback(() => {
    const myIdentity = room?.localParticipant.identity || '';
    setMediaStatus('help-needed');
    console.log('changing helpNeeded to', [...helpNeeded, myIdentity]);
    changeSharedState({ helpNeeded: [...helpNeeded, myIdentity] });
  }, [setMediaStatus, room, helpNeeded]);

  const onAllGood = useCallback(() => {
    setMediaStatus('ready');
  }, [setMediaStatus]);

  // get default media
  useEffect(() => dispatch('getLocalTracks'), []);

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to={rejectedPath()} />;

  if (!room) return <RoomJoinForm roomName={roomName}/>
  console.log('got past room check');

  if (mediaStatus === 'pending') return <GetMedia onNeedHelp={onNeedHelp} onAllGood={onAllGood}/>

  return roomStatus !== 'disconnected'
    ? meeting
      ? <Meeting group={meeting}/>
      : <Broadcast type="millicast" />
    : <SignIn roomName={roomName} role="audience"/>;
}

interface GetMediaProps {
  onAllGood: () => void,
  onNeedHelp: () => void,
}

function GetMedia({ onAllGood, onNeedHelp }: GetMediaProps) {
  return <>
    <h1>get media</h1>
    <DeviceSelector/>
    <Button onClick={onNeedHelp}>I need help</Button>
    <Button onClick={onAllGood}>All good</Button>
  </>
}
