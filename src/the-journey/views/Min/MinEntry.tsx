import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import WithFacts from './WithFacts';
import useMeeting from '../../hooks/useMeeting';
import Meeting from '../FOH/Meeting';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import { inGroup } from '../../utils/twilio';
import { ROOM_NAME } from '../../../App';

interface MinEntryProps {
  withFacts: boolean,
}
export default function MinEntry({ withFacts }: MinEntryProps) {
  const [{ room, roomStatus }] = useAppContext();
  const [{ rejected }] = useSharedRoomState();
  const { meeting } = useMeeting();
  const roomName = ROOM_NAME;

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to="/rejected" />;

  console.log('MinEntry', { withFacts });
  if (withFacts) console.log('doing a broadcast with facts');

  return roomStatus === 'connected'
    ? (
      <>
        { meeting
          ? <Meeting group={meeting}/>
          : withFacts
            ? <WithFacts><Broadcast type="millicast"/></WithFacts>
            : <Broadcast type="millicast"/>
        }
      </>
    )
    : <SignIn roomName={roomName} role="audience"/>;
}
