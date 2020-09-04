import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { getParticipants, isRole } from '../../utils/twilio';
import { codeToTime, formatTime, punctuality } from '../../utils/foh';
import moment from 'moment';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { Participant } from 'twilio-video';
import FOHStreamSources from '../../components/audio/FOHStreamSources';
import FOHMessaging from './components/FOHMessaging';
import Controls from '../../components/Controls/Controls';

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

export default function Holding() {
  const [{ room, participants, admitted, rejected }] = useContext(AppContext);
  const gallery = useGalleryParticipants({ withMuppets: true, withMe: true, inLobby: true });
  if (!room) return null;

  const foh = getParticipants(room).filter(isRole('foh'));
  const curtain = codeToTime(room!.name);
  const display = formatTime(curtain);

  console.log('this room has', room.participants.size, 'participants');
  console.log(foh.length, 'of them are foh');
  console.log('admitted/rejected', { admitted, rejected });
  console.log({ participants });

  return (
    <Container>
      <Main>
        <Column style={{width: '50%'}}>
          <FlexibleGallery participants={gallery}/>
        </Column>
        <Column style={{width: '50%'}}>
          <FlexibleGallery participants={foh}/>
        </Column>
      </Main>
      <Controls />
      <FOHStreamSources />
      {isRole('foh')(room.localParticipant) && <FOHMessaging />}
    </Container>
  )
}
