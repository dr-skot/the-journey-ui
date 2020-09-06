import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import useOperatorMessaging from './hooks/useOperatorMessaging';
import { styled } from '@material-ui/core/styles';

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
  const { forceGallery, forceHotKeys } = useOperatorControls({ withMuppets });
  const [{ focusGroup }] = useContext(AppContext);
  const gallery = useGalleryParticipants({ withMuppets });
  const focusing = focusGroup.length && !forceGallery;
  useOperatorMessaging();

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
