import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Facts/WithFacts';
import { Button } from '@material-ui/core';
import Subscribe from '../../subscribers/Subscribe';
import { useSharedRoomState } from '../../contexts/AppStateContext';

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

const half = (n: number) => Math.ceil(n / 2);

const MenuButton = (label: string, onClick: () => void) => (
  <Button
    onClick={onClick}
    style={{ margin: '0.5em' }}
    size="small" color="default" variant="contained">
      {label}
  </Button>
);

function OperatorView() {
  const [{ focusGroup }] = useSharedRoomState();
  const { toggleFocus } = useOperatorControls();
  let gallery = useParticipants().filter(isRole('audience'));
  useRerenderOnTrackSubscribed();

  // TODO consolidaate this with MinGallery
  const [hideBlanks, setHideBlanks] = useState(false);
  const [paged, setPaged] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const menuExtras = <>
      { paged && MenuButton(`${pageNumber === 2 ? 'page 1' : 'page 2'}`,
        () => setPageNumber((prev) => prev === 1 ? 2 : 1)) }
      { MenuButton(`${paged ? 'one page' : 'two pages'}`,
        () => setPaged((prev) => !prev)) }
      { MenuButton(`${hideBlanks ? 'show' : 'hide'} blanks`,
        () => setHideBlanks((prev) => !prev)) }
  </>;

  const mid = half(gallery.length);
  if (paged) gallery = pageNumber === 1 ? gallery.slice(0, mid) : gallery.slice(mid);

  const galleryProps = {
    participants: gallery,
    selection: focusGroup,
    fixedLength: hideBlanks ? undefined : paged ? half(GALLERY_SIZE) : GALLERY_SIZE,
    hotKeys: paged ? (pageNumber === 1 ? KEYS.slice(0, mid) : KEYS.slice(mid)) : KEYS,
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  return (
    <Container>
      <Subscribe profile="data-only" />
      <MenuBar extras={menuExtras}/>
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


export default function Operator() {

  return (
      <WithFacts>
        <OperatorView />
      </WithFacts>
  );
}
