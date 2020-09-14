import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from './SignIn';
import Broadcast from '../Broadcast/Broadcast';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import WithFacts from './WithFacts';
import useMeetup from '../../hooks/useMeetup';
import Meetup from '../FOH/Meetup';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import { inGroup } from '../../utils/twilio';

export default function MinEntry() {
  const [{ room, roomStatus }] = useAppContext();
  const [{ rejected }] = useSharedRoomState();
  const { meetup } = useMeetup();
  const roomName = 'min';

  if (inGroup(rejected)(room?.localParticipant)) return <Redirect to="/rejected" />;

  return roomStatus === 'connected'
    ? (
      <>
        <PlayAllSubscribedAudio/>
        { meetup
          ? <Meetup group={meetup}/>
          : <WithFacts><Broadcast type="millicast"/></WithFacts>
        }
      </>
    )
    : <SignIn roomName={roomName} role="audience"/>;
}
