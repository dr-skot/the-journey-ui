import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TwilioRoomContextProvider, { useTwilioRoomContext } from './the-journey/contexts/TwilioRoomContext';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import useHeight from './the-journey/hooks/useHeight/useHeight';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Rejected from './the-journey/views/Entry/Rejected';
// import SignLanguageEntry from './the-journey/views/Broadcast/components/SignLanguageEntry';
import AudioStreamContextProvider from './the-journey/contexts/AudioStreamContext/AudioStreamContext';
import RoomStateContextProvider from './the-journey/contexts/AppStateContext';
import Testing from './the-journey/views/Testing/Testing';
import FallbackToAudioElements from './the-journey/contexts/AudioStreamContext/FallbackToAudioElements';
import FocusGroup from './the-journey/views/Focus/FocusGroup';
import { getUsername } from './the-journey/utils/twilio';
import FOH from './the-journey/views/FOH/FOH';
import BlindOperator from './the-journey/views/Operator/Operator';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import WithFacts from './the-journey/views/Facts/WithFacts';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './the-journey/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Log from './the-journey/views/Log/Log';
import Comm from './the-journey/views/Comm/Comm';
import PrivateRoute from './the-journey/components/Auth/PrivateRoute';
import NewFrontDoor from './the-journey/views/Entry/NewFrontDoor';

// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';

export function NameHelmet() {
  const [{ room }] = useTwilioRoomContext();
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
      <TwilioRoomContextProvider>
        <NameHelmet/>
        <AudioStreamContextProvider>
          <FallbackToAudioElements/>
          <RoomStateContextProvider>
            <ReconnectingNotification />
            <div style={{ height }}>
              <Router>
                <Switch>
                  <Route path="/entry/:code?" component={NewFrontDoor}/>
                  <Route path="/test/:code?" render={(props) => (
                    <NewFrontDoor test {...props} />
                  )}/>

                  <Route path="/rejected" component={Rejected} />

                  <PrivateRoute roles="foh|operator" path="/code">
                    <GetCode/>
                  </PrivateRoute>
                  <PrivateRoute roles="foh|operator" path="/foh/:code?">
                    <FOH/>
                  </PrivateRoute>
                  <PrivateRoute roles="foh|operator" path="/comm/:code?">
                    <Comm/>
                  </PrivateRoute>


                  <PrivateRoute roles="operator" path="/operator/:code?">
                    <AutoJoin role="operator" /><BlindOperator />
                  </PrivateRoute>
                  <PrivateRoute roles="operator" path="/focus/:code?">
                    <AutoJoin role="focus" /><FocusGroup />
                  </PrivateRoute>
                  <PrivateRoute roles="operator" path="/gallery/:code?">
                    <AutoJoin role="gallery" options={{ maxTracks: '0' }} /><HalfGallery />
                  </PrivateRoute>
                  <PrivateRoute roles="operator" path="/log/:code?">
                    <Log/>
                  </PrivateRoute>

                  { /*
                  <PrivateRoute roles="captioning" path="/captioning/:code?">
                    <SignLanguageEntry />
                  </PrivateRoute>
                  */ }

                  <PrivateRoute roles="lurker|foh|operator" path="/lurk/:code?">
                    <AutoJoin role="lurker" />
                    <WithFacts><Broadcast /></WithFacts>
                  </PrivateRoute>

                  <PrivateRoute roles="operator" path="/testing/:code?">
                    <Testing />
                  </PrivateRoute>

                  <Route path="/">
                    <Redirect to="/trailer.m4v" />
                  </Route>

                </Switch>
              </Router>
            </div>
          </RoomStateContextProvider>
        </AudioStreamContextProvider>
      </TwilioRoomContextProvider>
      </UnsupportedBrowserWarning>
    </MuiThemeProvider>
  );


}

/*
const VideoAppFull = React.memo(({ view }: VideoAppProps) => {
  const { error, setError, settings } = useAppState();

  return (
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
  );
});
 */

