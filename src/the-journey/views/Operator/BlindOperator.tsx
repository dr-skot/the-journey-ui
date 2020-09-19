import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext, useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { getIdentities, isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToAllVideo from '../../subscribers/SubscribeToAllVideo';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Entry/WithFacts';
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

const half = (n: number) => Math.ceil(n / 2);

function MinOperatorView() {
  const sharedRoom = useContext(SharedRoomContext);
  const operatorControls = useOperatorControls();
  let gallery = useParticipants().filter(isRole('audience'));
  useRerenderOnTrackSubscribed();

  // TODO consolidaate this with MinGallery
  const [hideBlanks, setHideBlanks] = useState(false);
  const [paged, setPaged] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const menuExtras = (
    <>
      { paged && (
        <>
        <Button
          onClick={() => setPageNumber((prev) => prev === 1 ? 2 : 1)}
          style={{ margin: '0.5em' }}
          size="small" color="default" variant="contained"
        >
          {`${pageNumber === 2 ? 'page 1' : 'page 2'}`}
        </Button>
          </>
      ) }
      <Button
        onClick={() => setPaged((prev) => !prev)}
        style={{ margin: '0.5em' }}
        size="small" color="default" variant="contained"
      >
        {`${paged ? 'one page' : 'two pages'}`}
      </Button>
    <Button
      onClick={() => setHideBlanks((prev) => !prev)}
      style={{ margin: '0.5em' }}
      size="small" color="default" variant="contained"
    >
      {`${hideBlanks ? 'show' : 'hide'} blanks`}
    </Button>
      </>
  )

  const [{ focusGroup }] = sharedRoom;
  const { toggleFocus } = operatorControls;

  console.log('Operator is rerendering', { sharedRoom, focusGroup, operatorControls, gallery });


  const mid = half(gallery.length);
  if (paged) {
    gallery = pageNumber === 1 ? gallery.slice(0, mid) : gallery.slice(mid);
  }

  const identities = getIdentities(gallery);

  const galleryProps = {
    participants: gallery,
    selection: focusGroup,
    fixedLength: hideBlanks ? undefined : paged ? half(GALLERY_SIZE) : GALLERY_SIZE,
    hotKeys: paged ? (pageNumber === 1 ? KEYS.slice(0, mid) : KEYS.slice(mid)) : KEYS,
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  console.log('Operator passing', final === galleryProps ? 'cached' : 'uncached', 'gallery props', { final });

  return (
    <Container>
      <SubscribeToDataOnly />
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


export default function MinOperator() {

  return (
    <>
      <WithFacts>
        <MinOperatorView />
      </WithFacts>
    </>
  );
}
