import React from 'react';
import { styled } from '@material-ui/core/styles';
import { isRole } from '../../../utils/twilio';
import SignLanguageInterpreter from './SignLanguageInterpreter';
import HelpIsComingNotification from '../../Entry/components/HelpIsComingNotification';
import FlexibleGallery from '../../Gallery/FlexibleGallery';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupAudioAndStar from '../../../subscribers/SubscribeToFocusGroupAudioAndStar';
import WithFacts from '../../Facts/WithFacts';
import PlayAllSubscribedAudio from '../../../components/audio/PlayAllSubscribedAudio';

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
    <PlayAllSubscribedAudio/>
    <WithFacts>
      <Container>
        <Main>
          <FlexibleGallery participants={stars} />
        </Main>
        <SignLanguageInterpreter />
      </Container>
      <HelpIsComingNotification />
    </WithFacts>
  </>;
}
