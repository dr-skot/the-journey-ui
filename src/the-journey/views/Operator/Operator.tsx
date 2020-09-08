import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { styled } from '@material-ui/core/styles';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { inGroup } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import { elements, findIndexes } from '../../utils/functional';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import { Helmet } from 'react-helmet';

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

const EMPTY_ARRAY = Object.freeze([]);

export default function Operator(props: OperatorProps = {}) {
  const { withMuppets } = props;
  const sharedRoom = useContext(SharedRoomContext);
  const operatorControls = useOperatorControls({ withMuppets });
  const gallery = useGalleryParticipants({ withMuppets });

  const [{ focusGroup }] = sharedRoom;
  const { forceGallery, forceHotKeys, toggleFocus } = operatorControls;

  // console.log('Operator is rerendering', { sharedRoom, focusGroup, operatorControls, gallery, props });
  // reportEqual({ prefix: 'Operator', appContext, sharedRoom, operatorControls, gallery, props });

  const focusing = focusGroup.length && !forceGallery;
  const selector = focusing ? inGroup(focusGroup) : () => true;
  const groupIndexes = findIndexes(selector)(gallery);
  const selected = elements(groupIndexes)
  const hotKeys = selected(KEYS.split('')).join('');

  const galleryProps = {
    participants: selected(gallery),
    selection: focusing ? EMPTY_ARRAY : focusGroup,
    fixedLength: focusing ? undefined : GALLERY_SIZE,
    hotKeys: !focusing || forceHotKeys ? hotKeys : '',
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  console.log('Operator passing', final === galleryProps ? 'cached' : 'uncached', 'gallery props', { final });

  return (
    <Container>
      <Helmet><title>Operator : The Journey</title></Helmet>
      <MenuBar />
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
