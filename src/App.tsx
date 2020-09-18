import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppContextProvider, { useAppContext } from './the-journey/contexts/AppContext';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import FixedGallery from './the-journey/views/Gallery/FixedGallery';
import Operator from './the-journey/views/Operator/Operator';

import FocusGroupAudio from './the-journey/components/audio/FocusGroupAudio';
// import ReconnectingNotification from './twilio/components/ReconnectingNotification/ReconnectingNotification';

// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';
// import generateConnectionOptions from './twilio/utils/generateConnectionOptions/generateConnectionOptions';
// import UnsupportedBrowserWarning from './twilio/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

import useHeight from './the-journey/hooks/useHeight/useHeight';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';
// import FocusGroupAudioElements from './the-journey/components/audio/FocusGroupAudioElements';
// import FocusGroupElementNodes from './the-journey/components/audio/FocusGroupElementNodes';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Rejected from './the-journey/views/FOH/Rejected';
import CaptioningEntry from './the-journey/views/Broadcast/components/CaptioningEntry';
import AudioStreamContextProvider from './the-journey/contexts/AudioStreamContext/AudioStreamContext';
import SharedRoomContextProvider from './the-journey/contexts/SharedRoomContext';
import Chat from './the-journey/views/FOH/components/Chat/Chat';
import Testing from './the-journey/views/Testing/Testing';
import FallbackToAudioElements from './the-journey/contexts/AudioStreamContext/FallbackToAudioElements';
import MinEntry from './the-journey/views/Min/MinEntry';
import MinOperator from './the-journey/views/Operator/MinOperator';
import MinFocusGroup from './the-journey/views/Gallery/MinFocusGroup';
import { getUsername } from './the-journey/utils/twilio';
import MinFOH from './the-journey/views/FOH/MinFOH';
import BlindOperator from './the-journey/views/Operator/BlindOperator2';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import { isDev } from './the-journey/utils/react-help';
import WithFacts from './the-journey/views/Min/WithFacts';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './twilio/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

export const ROOM_NAME = isDev() ? 'min-dev' : 'min2';

export function NameHelmet() {
  const [{ room }] = useAppContext();
  const me = room?.localParticipant;
  return <Helmet><title>{me ? `${getUsername(me.identity)} : ` : ''}The Journey</title></Helmet>
}

export default function App() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  // TODO reinstate reconnecting notification

  console.log('RENDER APP')
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <UnsupportedBrowserWarning>
      <AppContextProvider>
        <NameHelmet/>
        <AudioStreamContextProvider>
          <FallbackToAudioElements/>
          <SharedRoomContextProvider>
            <ReconnectingNotification />
            <div style={{ height }}>
              <Router>
                <Switch>
                  <Route path="/min/blindop">
                    <AutoJoin roomName={ROOM_NAME} role="operator" /><BlindOperator />
                  </Route>
                  <Route path="/min/focus">
                    <AutoJoin roomName={ROOM_NAME} role="focus" /><MinFocusGroup />
                  </Route>
                  <Route path="/min/gallery">
                    <AutoJoin roomName={ROOM_NAME} role="lurker" options={{ maxTracks: '0' }} /><HalfGallery />
                  </Route>
                  <Route path="/min/lurk">
                    <AutoJoin roomName={ROOM_NAME} role="lurker" />
                    <WithFacts><Broadcast type="millicast"/></WithFacts>
                  </Route>
                  <Route path="/min/foh" component={MinFOH}/>
                  <Route path="/min" component={MinEntry}/>
                  <Route path="/min/facts">
                    { console.log('/min/facts') }
                    <MinEntry withFacts />
                  </Route>

                  <Route path="/entry/:code?" component={MinEntry}/>
                  <Route path="/rejected" component={Rejected} />

                  <Route path="/code" component={GetCode} />
                  <Route path="/foh/:code?" component={MinFOH}/>

                  <Route path="/operator/:code?">
                    <AutoJoin roomName={ROOM_NAME} role="operator" /><BlindOperator />
                  </Route>
                  <Route path="/focus/:code?">
                    <AutoJoin roomName={ROOM_NAME} role="focus" /><MinFocusGroup />
                  </Route>
                  <Route path="/gallery/:code?">
                    <AutoJoin roomName={ROOM_NAME} role="gallery" options={{ maxTracks: '0' }} /><HalfGallery />
                  </Route>

                  <Route path="/captioning/:code?" component={CaptioningEntry} />

                  <Route path="/lurk/:code?">
                    <AutoJoin roomName={ROOM_NAME} role="lurker" />
                    <WithFacts><Broadcast type="millicast"/></WithFacts>
                  </Route>

                  <Route path="/testing/:code?" component={Testing}/>
                  <Route path="/" component={MinEntry} />

                </Switch>
              </Router>
            </div>
          </SharedRoomContextProvider>
        </AudioStreamContextProvider>
      </AppContextProvider>
      </UnsupportedBrowserWarning>
    </MuiThemeProvider>
  );


}

/*
const VideoAppFull = React.memo(({ view }: VideoAppProps) => {
  const { error, setError, settings } = useAppState();
  const connectionOptions = generateConnectionOptions(settings);

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError} lurk={view === 'gallery' || view === 'operator'}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
});
 */

