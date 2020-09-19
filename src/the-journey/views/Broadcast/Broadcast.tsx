import React, { useContext, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { AppContext } from '../../contexts/AppContext';
import Millicast from './Millicast';
import { inGroup } from '../../utils/twilio';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import SignLanguageInterpreter from './components/SignLanguageInterpreter';
import WithFacts from '../Entry/WithFacts';

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

const Column = styled('div')(() => ({
  flex: '1 1 0',
}));


export type BroadcastType = 'millicast' | 'hybrid' | 'pure'
interface BroadcastProps {
  type?: BroadcastType,
}

export default function Broadcast({ type }: BroadcastProps) {
  useHighPriorityInFocusGroup();

  return (
    <>
    <SubscribeToFocusGroupAudio/>
    <FocusGroupAudio/>
    <WithFacts>
      <Container>
        <Main>
          <Millicast/>
        </Main>
        <SignLanguageInterpreter />
      </Container>
    </WithFacts>
    </>
  );
}

function useHighPriorityInFocusGroup() {
  const [{ room }] = useContext(AppContext);
  const [{ focusGroup }] = useContext(SharedRoomContext);

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
}
