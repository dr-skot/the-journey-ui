import useMinOperatorControls, { KEYS } from './hooks/useMinOperatorControls';
import React, { useContext, useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { styled } from '@material-ui/core/styles';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { getIdentities, isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToAllVideo from '../../subscribers/SubscribeToAllVideo';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Min/WithFacts';
import { Button } from '@material-ui/core';
import SubscribeToVideoOfGroup from '../../subscribers/SubscribeToVideoOfGroup';
import SubscribeToDataOnly from '../../subscribers/SubscribeToDataOnly';


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

function BlindOperatorView() {
  const sharedRoom = useContext(SharedRoomContext);
  const operatorControls = useMinOperatorControls();
  let gallery = useParticipants().filter(isRole('audience'));

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

  const final = cached('BlindOperator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  console.log('BlindOperator passing', final === galleryProps ? 'cached' : 'uncached', 'gallery props', { final });

  return (
    <Container>
      <SubscribeToDataOnly />
      <MenuBar />
      <Main>
        <FlexibleGallery
          participants={final.participants}
          selection={final.selection}
          fixedLength={final.fixedLength}
          hotKeys={final.hotKeys}
          onClick={final.onClick}
          muteControls={true}
        />
      </Main>
    </Container>
  );
}


export default function BlindOperator() {

  return (
    <>
      <WithFacts>
        <BlindOperatorView />
      </WithFacts>
    </>
  );
}
