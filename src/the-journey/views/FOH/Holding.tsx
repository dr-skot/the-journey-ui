import React, { useContext, useEffect } from 'react';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { isRole } from '../../utils/twilio';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import Controls from '../../components/Controls/Controls';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { not } from '../../utils/functional';
import useParticipants from '../../hooks/useParticipants/useParticipants';

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
  const gallery = useGalleryParticipants({ withMuppets: true, withMe: true, inLobby: true });
  const foh = useParticipants().filter(isRole('foh'));
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ mutedInLobby }] = useContext(SharedRoomContext);

  // turn everybody's audio on
  useEffect(() => {
    const group = [...gallery, ...foh].map((p) => p.identity)
      .filter((identity) => !mutedInLobby.includes(identity));
    setUnmutedGroup(group);
  }, [gallery, foh, mutedInLobby]);

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
    </Container>
  )
}
