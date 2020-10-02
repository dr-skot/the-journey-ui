import React, { useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from './FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { getIdentities, isRole } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Facts/WithFacts';
import { Button } from '@material-ui/core';
import Subscribe from '../../subscribers/Subscribe';


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

function HalfGalleryView() {
  let gallery = useParticipants().filter(isRole('audience'));
  useRerenderOnTrackSubscribed();

  const [hideBlanks, setHideBlanks] = useState(false);
  const [twoPage, setTwoPage] = useState(false);
  const [galleryPage, setGalleryPage] = useState(1);
  const [halfSubscribe, setHalfSubscribe] = useState(false);

  const menuExtras = <>
      { twoPage && (
        <>
          Video: subscribed to {halfSubscribe ? 'page' : 'all'}
          { MenuButton(`subscribe to ${halfSubscribe ? 'all' : 'page'}`,
            () => setHalfSubscribe((prev) => !prev)) }
          { MenuButton(`${galleryPage === 2 ? 'page 1' : 'page 2'}`,
            () => setGalleryPage((prev) => prev === 1 ? 2 : 1)) }
        </>
      ) }
      { MenuButton(`${twoPage ? 'one page' : 'two pages'}`,
        () => setTwoPage((prev) => !prev)) }
      { MenuButton(`${hideBlanks ? 'show' : 'hide'} blanks`,
        () => setHideBlanks((prev) => !prev))}
  </>;

  const mid = half(gallery.length);
  if (twoPage) gallery = galleryPage === 1 ? gallery.slice(0, mid) : gallery.slice(mid);

  const identities = getIdentities(gallery);

  const galleryProps = {
    participants: gallery,
    fixedLength: hideBlanks ? undefined : twoPage ? half(GALLERY_SIZE) : GALLERY_SIZE,
    rightAlign: twoPage && galleryPage === 1,
  };

  const final = cached('HalfGallery.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  return (
    <Container>
      { twoPage && halfSubscribe ? <Subscribe profile="watch" focus={identities}/> : <Subscribe profile="gallery" /> }
      <MenuBar extras={menuExtras}/>
      <Main>
        <FlexibleGallery
          participants={final.participants}
          selection={final.selection}
          fixedLength={final.fixedLength}
          hotKeys={final.hotKeys}
          onClick={final.onClick}
          blanks="nothing"
          rightAlign={final.rightAlign}
        />
      </Main>
    </Container>
  );
}


export default function HalfGallery() {
  return (
    <>
      <WithFacts>
        <HalfGalleryView />
      </WithFacts>
    </>
  );
}
