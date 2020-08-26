import React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/NamelessMenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Gallery from './components/Gallery/Gallery';
import GalleryMenuBar from './components/Gallery/JoinGallery';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import Room from './components/Show/Room';

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

  console.log('render App', { roomState, params });

  function getView() {
    console.log('getView', { view, roomState });
    // @ts-ignore
    if (view === 'gallery') return roomState === 'disconnected' ? <div /> : <Gallery />;
    if (roomState === 'disconnected') return <LocalVideoPreview />;
    return <Room />
  }

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      { view === 'gallery' ? <GalleryMenuBar /> : <MenuBar /> }
      <Main>
        {getView()}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
