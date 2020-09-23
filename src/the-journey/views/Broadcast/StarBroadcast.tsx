import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import Millicast from './Millicast';
import { inGroup, isRole } from '../../utils/twilio';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import SignLanguageInterpreter from './components/SignLanguageInterpreter';
import HelpIsComingNotification from '../Entry/components/HelpIsComingNotification';
import { useRoomState } from '../../contexts/AppStateContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuedView from '../MenuedView';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupAudioAndStar from '../../subscribers/SubscribeToFocusGroupAudioAndStar';

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
  const stars = useParticipants().filter(isRole('star'));

  return <>
    <SubscribeToFocusGroupAudioAndStar/>
    <FocusGroupAudio/>
      <Container>
        <Main>
          <FlexibleGallery participants={stars} />
        </Main>
        <SignLanguageInterpreter />
      </Container>
    <HelpIsComingNotification />
  </>;
}
