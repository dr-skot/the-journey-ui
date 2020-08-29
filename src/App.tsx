import React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './the-journey/views/Show/NamelessMenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Gallery from './the-journey/views/Gallery/Gallery';
import GalleryMenuBar from './the-journey/views/Gallery/JoinGallery';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import Room from './the-journey/views/Show/Room';
import DelayedRoom from './the-journey/views/Show/DelayedRoom';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

export default function App() {
  const roomState = useRoomState();
  const params = useParams();
  // @ts-ignore
  const { view } = params;

  function getView() {
    // @ts-ignore
    if (view === 'gallery' || view === 'operator') return roomState === 'disconnected'
      ? <div /> : <Gallery isOperator={view === 'operator'} />;
    if (roomState === 'disconnected') return <LocalVideoPreview />;
    return view === 'delayed' ? <DelayedRoom /> : <Room />;
  }

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  // TODO too many conditionals here; make different components for show and gallery
  return (
    <Container style={{ height }}>
      { view === 'gallery' || view === 'operator' ? <GalleryMenuBar isOperator={view === 'operator'} /> : <MenuBar /> }
      <Main>
        {getView()}
        { view !== 'gallery' && <Controls /> }
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
