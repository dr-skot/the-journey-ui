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
  const operatorControls = useMinOperatorControls();
  let gallery = useParticipants().filter(isRole('audience'));
  useRerenderOnTrackSubscribed();

  // TODO consolidaate this with MinGallery
  const [hideBlanks, setHideBlanks] = useState(false);
  const [twoPage, setTwoPage] = useState(false);
  const [galleryPage, setGalleryPage] = useState(1);
  const [halfSubscribe, setHalfSubscribe] = useState(false);


  const menuExtras = (
    <>
      { twoPage && (
        <>
          Video: subscribed to {halfSubscribe ? 'page' : 'all'}
          <Button
            onClick={() => setHalfSubscribe((prev) => !prev)}
            style={{ margin: '0.5em' }}
            size="small" color="default" variant="contained"
          >
            {`subscribe to ${halfSubscribe ? 'all' : 'page'}`}
          </Button>
        <Button
          onClick={() => setGalleryPage((prev) => prev === 1 ? 2 : 1)}
          style={{ margin: '0.5em' }}
          size="small" color="default" variant="contained"
        >
          {`${galleryPage === 2 ? 'page 1' : 'page 2'}`}
        </Button>
          </>
      ) }
      <Button
        onClick={() => setTwoPage((prev) => !prev)}
        style={{ margin: '0.5em' }}
        size="small" color="default" variant="contained"
      >
        {`${twoPage ? 'one page' : 'two pages'}`}
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
  if (twoPage) {
    gallery = galleryPage === 1 ? gallery.slice(0, mid) : gallery.slice(mid);
  }

  const identities = getIdentities(gallery);

  const galleryProps = {
    participants: gallery,
    selection: focusGroup,
    fixedLength: hideBlanks ? undefined : twoPage ? half(GALLERY_SIZE) : GALLERY_SIZE,
    hotKeys: twoPage ? (galleryPage === 1 ? KEYS.slice(0, mid) : KEYS.slice(mid)) : KEYS,
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  console.log('Operator passing', final === galleryProps ? 'cached' : 'uncached', 'gallery props', { final });

  return (
    <Container>
      { twoPage && halfSubscribe ? <SubscribeToVideoOfGroup group={identities}/> : <SubscribeToAllVideo /> }
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
