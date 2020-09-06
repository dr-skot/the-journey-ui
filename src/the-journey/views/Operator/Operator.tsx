import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext } from 'react';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { styled } from '@material-ui/core/styles';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { AppContext } from '../../contexts/AppContext';

const Container = styled('div')({
  display: 'flex',
  flexFlow: 'column',
  height: '100%',
});

const Main = styled('div')({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
});

interface OperatorProps {
  withMuppets?: boolean,
}

export default function Operator({ withMuppets }: OperatorProps = {}) {
  const [{ room }] = useContext(AppContext);
  const { forceGallery, forceHotKeys } = useOperatorControls({ withMuppets });
  const [{ focusGroup }] = useContext(SharedRoomContext);
  // const gallery = useGalleryParticipants({ withMuppets });
  const gallery = useParticipants();

  console.log('useParticipants', gallery);
  console.log('room.participants', room?.participants);
  const focusing = focusGroup.length && !forceGallery;

  return (
    <Container>
      <MenuBar isOperator/>
      <Main>
      <FlexibleGallery
        participants={gallery.filter(p => focusing ? focusGroup.includes(p.identity) : true)}
        selection={focusing ? [] : focusGroup}
        fixedLength={focusing ? undefined : GALLERY_SIZE}
        hotKeys={!focusing || forceHotKeys ? KEYS : ''}
      />
      </Main>
    </Container>
  );
}
Operator.whyDidYouRender = false;
