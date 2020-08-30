import React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';

import AudienceMenuBar from './the-journey/views/Show/components/MenuBar';
import GalleryMenuBar from './the-journey/views/Gallery/components/MenuBar';
import { FixedGallery, Operator } from './the-journey/views/Gallery/Gallery';
import Room from './the-journey/views/Show/Room';
import NonDelayedRoom from './the-journey/views/Show/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

interface ViewProps {
  view: string,
  roomState: string,
}

function View({ view, roomState }: ViewProps) {
  if (roomState === 'disconnected') {
    return ['gallery', 'operator'].includes(view) ? <div/> : <LocalVideoPreview/>;
  }
  switch (view) {
    case 'operator':
      return <Operator/>;
    case 'gallery':
      return <FixedGallery/>;
    case 'nodelay':
      return <><NonDelayedRoom/><Controls/></>
    default:
      return <><Room/><Controls/></>
  }
}


export default function App() {
  const roomState = useRoomState();
  const params = useParams();
  // @ts-ignore
  const { view } = params;

  console.log('render App', { roomState, params, view });

  function MenuBar() {
    return ['gallery', 'operator'].includes(view) ? <GalleryMenuBar/> : <AudienceMenuBar/>;
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
      <MenuBar />
      <Main>
        <View view={view} roomState={roomState} />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
