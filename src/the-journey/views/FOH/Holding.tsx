import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { getParticipants, isRole } from '../../utils/twilio';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
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
  const [{ room }] = useContext(AppContext);
  const gallery = useGalleryParticipants({ withMuppets: true, withMe: true, inLobby: true });
  if (!room) return null;

  // TODO do we need a useParticipants(role)?
  const foh = getParticipants(room).filter(isRole('foh'));

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
