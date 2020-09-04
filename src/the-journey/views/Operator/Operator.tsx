import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { Participant } from 'twilio-video';
import useOperatorMessaging from './hooks/useOperatorMessaging';
import { styled } from '@material-ui/core/styles';
import { getTimestamp } from '../../utils/twilio';

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

let count = 0;

export default function Operator() {
  const { forceGallery, forceHotKeys, toggleFocus } = useOperatorControls();
  const [{ focusGroup, participants: p }, dispatch] = useContext(AppContext);

  const focusing = focusGroup.length && !forceGallery;

  const gp = useGalleryParticipants();
  const participants = gp
    .filter(p => focusing ? focusGroup.includes(p.identity) : true);

  useOperatorMessaging();

  return (
    <Container>
      <MenuBar isOperator/>
      <Main>
      <FlexibleGallery
        participants={useGalleryParticipants().filter(p => focusing ? focusGroup.includes(p.identity) : true)}
        selection={focusing ? [] : focusGroup}
        fixedLength={focusing ? undefined : GALLERY_SIZE}
        hotKeys={!focusing || forceHotKeys ? KEYS : ''}
        mute={true}
      />
      </Main>
    </Container>
  );
}
Operator.whyDidYouRender = false;
