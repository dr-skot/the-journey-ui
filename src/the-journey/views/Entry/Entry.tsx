import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { useSharedRoomState } from '../../contexts/AppStateContext';
import { inGroup, isStaffed } from '../../utils/twilio';
import GetMedia, { Sorry, ThatsAll } from './GetMedia';
import NameForm from './NameForm';
import useRoomName from '../../hooks/useRoomName';
import { Room } from 'twilio-video';
import SimpleMessage from '../SimpleMessage';

function rejectedPath() {
  return window.location.pathname.replace('entry', 'rejected');
}

type MediaStatus = 'pending' | 'ready' | 'help-needed'

export default function Entry({ test }: { test?: boolean }) {
  const [{ room, roomStatus }, dispatch] = useTwilioRoomContext();
  const [{ rejected, helpNeeded }, roomStateDispatch] = useSharedRoomState();
  const [mediaStatus, setMediaStatus] = useState<MediaStatus>('pending');
  const { meeting } = useMeeting();

  const roomName = useRoomName() + (test ? '-test' : '');

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

  if (!isStaffed(room)) return <UnstaffedRoomMessage/>;

  if (mediaStatus === 'pending') return <GetMedia onNeedHelp={onNeedHelp} onAllGood={onAllGood}/>

  if (test) return helpNeeded.includes(room?.localParticipant.identity) ? <Sorry/> : <ThatsAll/>;

  // TODO should go back to NameForm
  return roomStatus !== 'disconnected'
    ? meeting ? <Meeting group={meeting}/> : <Broadcast />
    : <SignIn roomName={roomName} role="audience"/>;
}

function UnstaffedRoomMessage() {
  return <SimpleMessage
    title="Empty theater!"
    paragraphs={[
      <>There doesn't seem to be a show running here.</>,
      <>Please contact the box office for a valid show address.</>,
    ]}
  />
}

export function StaffCheck({ children }: { children: ReactNode }) {
  const [{ room }] = useTwilioRoomContext();
  return room && !isStaffed(room)
    ? <UnstaffedRoomMessage/>
    : <>{ children }</>;
}
