import React, { useContext } from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from './twilio/components/Controls/Controls';
import LocalVideoPreview from './the-journey/views/Audience/components/LocalVideoPreview';
import ReconnectingNotification from './twilio/components/ReconnectingNotification/ReconnectingNotification';

import AudienceMenuBar from './the-journey/views/Audience/components/MenuBar';
import GalleryMenuBar from './the-journey/views/Gallery/components/MenuBar';
import { FixedGallery, Operator } from './the-journey/views/Gallery/Gallery';
import Room from './the-journey/views/Audience/Room';
import NonDelayedRoom from './the-journey/views/Show/Room';

import useHeight from './twilio/hooks/useHeight/useHeight';
import useRoomState from './twilio/hooks/useRoomState/useRoomState';
import Experiment from './the-journey/sandbox/Experiment';
import { AppContext } from './the-journey/contexts/AppContext';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

interface ViewProps {
  view: string,
}

function View({ view }: ViewProps) {
  const [{ roomStatus }] = useContext(AppContext);

  if (roomStatus === 'disconnected') {
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
      return <><Room/></> // TODO reinstate controls
  }
}

function MenuBar({ view }: ViewProps) {
  return ['gallery', 'operator'].includes(view) ? <GalleryMenuBar view={view}/> : <AudienceMenuBar/>;
}


const App = React.memo(({ view }: ViewProps) => {

  console.log('render App', { view });

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  // TODO reinstate reconnecting notification

  return (
    <Container style={{ height }}>
      <MenuBar view={view} />
      <Main>
        <View view={view} />
      </Main>
      { /* <ReconnectingNotification /> */ }
    </Container>
  );
});
App.whyDidYouRender = true;

export default App;
