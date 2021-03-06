import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import Millicast from './Millicast';
import { inGroup } from '../../utils/twilio';
import HelpIsComingNotification from '../Entry/components/HelpIsComingNotification';
import { useAppState } from '../../contexts/AppStateContext';
import SubscribeToFocusGroupAudioMinusMutedMinusRoommates
  from '../../subscribers/SubscribeToFocusGroupAudioMinusMutedMinusRoommates';
import PlayAudioTracks from '../../components/audio/PlayAudioTracks';

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100%',
}));

const Main = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}));

export default function Broadcast() {
  console.log("RENDER: Broadcast");

  return <>
    <SubscribeToFocusGroupAudioMinusMutedMinusRoommates/>
    <PlayAudioTracks controlled/>
    <HighPriorityInFocusGroup/>
      <Container>
        <Main>
          <Millicast/>
        </Main>
      </Container>
    <HelpIsComingNotification />
  </>;
}

function HighPriorityInFocusGroup() {
  const [{ room }] = useTwilioRoomContext();
  const [{ focusGroup }] = useAppState();

  // change video priority when entering and leaving the focus group
  useEffect(() => {
    if (!room) return;
    const me = room.localParticipant;
    const priority = inGroup(focusGroup)(me) ? 'high' : 'low';
    const videoTrackPub = me.videoTracks.values().next()?.value;
    if (!videoTrackPub) return;
    if (videoTrackPub.priority !== priority) {
      console.log('changing my video priority to', priority);
      videoTrackPub.setPriority(priority);
    }
  }, [focusGroup, room]);

  return null;
}
