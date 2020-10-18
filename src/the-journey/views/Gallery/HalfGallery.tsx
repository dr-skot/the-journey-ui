import React, { useState } from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from './FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { getIdentities } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Facts/WithFacts';
import Subscribe from '../../subscribers/Subscribe';
import MenuButton from '../../components/MenuBar/MenuButton';
import usePagedAudience from './usePagedAudience';


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

function HalfGalleryView() {
  // useRerenderOnTrackSubscribed(); // TODO is this necessary? only for non-fixed I think
  const [halfSubscribe, setHalfSubscribe] = useState(false);
  const { gallery, paged, hideBlanks, menuButtons, order } = usePagedAudience();

  const menuExtras = <>
    { paged && <>
        Video: subscribed to {halfSubscribe ? 'page' : 'all'}
        { MenuButton(`subscribe to ${halfSubscribe ? 'all' : 'page'}`,
          () => setHalfSubscribe((prev) => !prev)) }
      </> }
    { menuButtons }
  </>;

  const galleryProps = {
    participants: gallery,
    fixedLength: hideBlanks ? undefined : paged ? half(GALLERY_SIZE) : GALLERY_SIZE,
    order,
  };

  const final = cached('HalfGallery.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;
  const identities = getIdentities(order.map((n) => gallery[n - 1]).filter((p) => !!p));

  return (
    <Container>
      { paged && halfSubscribe ? <Subscribe profile="watch" focus={identities}/> : <Subscribe profile="gallery" /> }
      <MenuBar extras={menuExtras}/>
      <Main>
        <FlexibleGallery
          participants={final.participants}
          fixedLength={final.fixedLength}
          order={final.order}
          blanks="nothing"
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
