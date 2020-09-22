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
import GetMedia, { PleaseEmail, ThatsAll } from './GetMedia';
import NameForm from './NameForm';

function rejectedPath() {
  return window.location.pathname.replace('entry', 'rejected');
}

type MediaStatus = 'pending' | 'ready' | 'help-needed'

interface EntryProps {
  roomName?: string;
  test?: boolean;
}
export default function Entry({ roomName = defaultRoom(), test }: EntryProps) {
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
  }, [setMediaStatus, room, helpNeeded, changeSharedState]);

  const onAllGood = useCallback(() => {
    setMediaStatus('ready');
  }, [setMediaStatus]);

  // get default media
  useEffect(() => dispatch('getLocalTracks'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to={rejectedPath()} />;

  if (!room) return <NameForm roomName={roomName}/>
  console.log('got past room check');

  if (mediaStatus === 'pending') return <GetMedia onNeedHelp={onNeedHelp} onAllGood={onAllGood}/>

  if (test) return helpNeeded.includes(room?.localParticipant.identity) ? <PleaseEmail/> : <ThatsAll/>;

  return roomStatus !== 'disconnected'
    ? meeting
      ? <Meeting group={meeting}/>
      : <Broadcast type="millicast" />
    : <SignIn roomName={roomName} role="audience"/>;
}
