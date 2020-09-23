import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { useRoomState } from '../../contexts/AppStateContext';
import { defaultRoom, inGroup } from '../../utils/twilio';
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
  const [{ room, roomStatus }, dispatch] = useTwilioRoomContext();
  const [{ rejected, helpNeeded }, roomStateDispatch] = useRoomState();
  const [mediaStatus, setMediaStatus] = useState<MediaStatus>('pending');
  const { meeting } = useMeeting();

  const onNeedHelp = useCallback(() => {
    setMediaStatus('help-needed');
    roomStateDispatch('toggleMembership', { group: 'helpNeeded' });
  }, [setMediaStatus, roomStateDispatch]);

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

  // TODO should go back to NameForm
  return roomStatus !== 'disconnected'
    ? meeting ? <Meeting group={meeting}/> : <Broadcast />
    : <SignIn roomName={roomName} role="audience"/>;
}
