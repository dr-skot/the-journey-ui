import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './the-journey/components/Auth/PrivateRoute';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import useHeight from './the-journey/hooks/useHeight/useHeight';
import TwilioRoomContextProvider, { useTwilioRoomContext } from './the-journey/contexts/TwilioRoomContext';
import { getUsername } from './the-journey/utils/twilio';
import AudioStreamContextProvider from './the-journey/contexts/AudioStreamContext/AudioStreamContext';
import FallbackToAudioElements from './the-journey/contexts/AudioStreamContext/FallbackToAudioElements';
import RoomStateContextProvider from './the-journey/contexts/AppStateContext';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import Rejected from './the-journey/views/Entry/Rejected';
import Testing from './the-journey/views/Testing/Testing';
import FocusGroup from './the-journey/views/Focus/FocusGroup';
import FOH from './the-journey/views/FOH/FOH';
import BlindOperator from './the-journey/views/Operator/Operator';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import WithFacts from './the-journey/views/Facts/WithFacts';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './the-journey/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Log from './the-journey/views/Log/Log';
import Comm from './the-journey/views/Comm/Comm';
import FrontDoor from './the-journey/views/Entry/FrontDoor';
import HomePage from './the-journey/views/HomePage';
import ClearRoom from './the-journey/views/Operator/ClearRoom';
import Entry, { StaffCheck } from './the-journey/views/Entry/Entry';

// import SignLanguageEntry from './the-journey/views/Broadcast/components/SignLanguageEntry';
// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';

export function NameHelmet() {
  const [{ room }] = useTwilioRoomContext();
  const me = room?.localParticipant;
  return <Helmet><title>{me ? `${getUsername(me.identity)} : ` : ''}The Journey</title></Helmet>
}

function Twilio({ children }: { children: ReactNode }) {
  return (
    <UnsupportedBrowserWarning>
      <TwilioRoomContextProvider>
        <NameHelmet/>
        <AudioStreamContextProvider>
          <FallbackToAudioElements/>
          <RoomStateContextProvider>
            <ReconnectingNotification />
            { children }
          </RoomStateContextProvider>
        </AudioStreamContextProvider>
      </TwilioRoomContextProvider>
    </UnsupportedBrowserWarning>
  );
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
        <Helmet><title>The Journey</title></Helmet>
            <div style={{ height }}>
              <Router>
                <Switch>

                  <Route path="/entry/:code">
                    <Twilio><FrontDoor/></Twilio>
                  </Route>
                  <Route path="/test/:code?">
                    <Twilio><Entry test/></Twilio>
                  </Route>
                  <Route path="/rejected">
                    <Twilio><Rejected/></Twilio>
                  </Route>

                  <PrivateRoute path="/code" roles="foh|operator">
                    <GetCode/>
                  </PrivateRoute>
                  <PrivateRoute path="/foh/:code?" roles="foh|operator" >
                    <Twilio><FOH/></Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/comm/:code?" roles="foh|operator">
                    <Twilio><Comm/></Twilio>
                  </PrivateRoute>

                  <PrivateRoute path="/ninja/:code?" roles="operator">
                    <Twilio><Entry/></Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/operator/:code?" roles="operator">
                    <Twilio><AutoJoin role="operator" /><BlindOperator /></Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/focus/:code?" roles="operator">
                    <Twilio><AutoJoin role="focus" /><FocusGroup /></Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/gallery/:code?" roles="operator">
                    <Twilio>
                      <AutoJoin role="gallery" options={{ maxTracks: '0' }} />
                      <HalfGallery />
                    </Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/log/:code?" roles="operator">
                    <Twilio><Log/></Twilio>
                  </PrivateRoute>
                  <PrivateRoute path="/clear/:code?" roles="operator">
                    <Twilio><ClearRoom/></Twilio>
                  </PrivateRoute>

                  { /*
                  <PrivateRoute roles="captioning" path="/captioning/:code?">
                    <SignLanguageEntry />
                  </PrivateRoute>
                  */ }

                  <PrivateRoute path="/lurk/:code?" roles="lurker|foh|operator">
                    <Twilio>
                      <AutoJoin role="lurker"/>
                      <StaffCheck>
                        <WithFacts><Broadcast /></WithFacts>
                      </StaffCheck>
                    </Twilio>
                  </PrivateRoute>

                  <PrivateRoute path="/testing/:code?" roles="operator">
                    <Twilio>
                      <Testing />
                    </Twilio>
                  </PrivateRoute>

                  <Route exact path="/" component={HomePage}/>
                  <Redirect to="/" />

                </Switch>
              </Router>
            </div>
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

