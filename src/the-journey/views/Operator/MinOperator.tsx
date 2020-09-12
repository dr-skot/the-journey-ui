import useMinOperatorControls, { KEYS } from './hooks/useMinOperatorControls';
import React, { useContext, useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { styled } from '@material-ui/core/styles';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToAllVideo from '../../subscribers/SubscribeToAllVideo';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Min/WithFacts';


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

function MinOperatorView() {
  const sharedRoom = useContext(SharedRoomContext);
  const operatorControls = useMinOperatorControls();
  const gallery = useParticipants().filter(isRole('audience'));
  useRerenderOnTrackSubscribed();

  const [{ focusGroup }] = sharedRoom;
  const { toggleFocus } = operatorControls;

  console.log('Operator is rerendering', { sharedRoom, focusGroup, operatorControls, gallery });

  const galleryProps = {
    participants: gallery,
    selection: focusGroup,
    fixedLength: GALLERY_SIZE,
    hotKeys: KEYS,
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  console.log('Operator passing', final === galleryProps ? 'cached' : 'uncached', 'gallery props', { final });

  return (
    <Container>
      <MenuBar/>
      <Main>
        <FlexibleGallery
          participants={final.participants}
          selection={final.selection}
          fixedLength={final.fixedLength}
          hotKeys={final.hotKeys}
          onClick={final.onClick}
        />
      </Main>
      <FocusGroupAudio />
    </Container>
  );
}


export default function MinOperator() {

  return (
    <>
      <SubscribeToAllVideo />
      <WithFacts>
        <MinOperatorView />
      </WithFacts>
    </>
  );
}
