import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './the-journey/components/Auth/PrivateRoute';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
// import useHeight from './the-journey/hooks/useHeight/useHeight';
import TwilioRoomContextProvider, { useTwilioRoomContext } from './the-journey/contexts/TwilioRoomContext';
import { getUsername } from './the-journey/utils/twilio';
import AudioStreamContextProvider from './the-journey/contexts/AudioStreamContext/AudioStreamContext';
import FallbackToAudioElements from './the-journey/contexts/AudioStreamContext/FallbackToAudioElements';
import AppStateContextProvider from './the-journey/contexts/AppStateContext';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import Rejected from './the-journey/views/Entry/Rejected';
import Testing from './the-journey/views/Testing/Testing';
import FocusGroup from './the-journey/views/Focus/FocusGroup';
import FOH from './the-journey/views/FOH/FOH';
import Operator from './the-journey/views/Operator/Operator';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import WithFacts from './the-journey/views/Facts/WithFacts';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './the-journey/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Log from './the-journey/views/Log/Log';
import ShowtimeCheck from './the-journey/views/Entry/ShowtimeCheck';
import HomePage from './the-journey/views/HomePage';
import ClearRoom from './the-journey/views/Operator/ClearRoom';
import Entry from './the-journey/views/Entry/Entry';
import Log2 from './the-journey/views/Log/Log2';
import Show from './the-journey/views/Entry/Show';
import UnstaffedRoomCheck from './the-journey/components/UnstaffedRoomCheck';
import PopulateDemo from './the-journey/views/Gallery/PopulateDemo';
import TwilioMin from './the-journey/views/Testing/TwilioMin';

// import SignLanguageEntry from './the-journey/views/Broadcast/components/SignLanguageEntry';
// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';

export function NameHelmet() {
  const [{ room }] = useTwilioRoomContext();
  const me = room?.localParticipant;
  return <Helmet><title>{me ? `${getUsername(me.identity)} : ` : ''}The Journey</title></Helmet>
}

export function Twilio({ children }: { children: ReactNode }) {
  return (
    <UnsupportedBrowserWarning>
      <TwilioRoomContextProvider>
        <NameHelmet/>
        <AudioStreamContextProvider>
          <FallbackToAudioElements/>
          <AppStateContextProvider>
            <ReconnectingNotification />
            { children }
          </AppStateContextProvider>
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
  // const height = useHeight();

  console.log('RENDER APP');
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
        <Helmet><title>The Journey</title></Helmet>
            <div style={{ height: '100vh' }}>
              <Router>
                <Switch>
                  <Route path="/pop" component={PopulateDemo}/>
                  <Route path="/min" component={TwilioMin}/>

                  <PrivateRoute path="/code" roles="foh|operator">
                    <GetCode/>
                  </PrivateRoute>

                  <Route exact path="/" component={HomePage}/>
                  <Route
                    path={(
                      '/entry/:code /show/:code? /test/:code? /rejected/:code? ' +
                      '/ninja/:code? /lurk/:code? /foh/:code? /operator/:code? /focus/:code? ' +
                      '/gallery/:code? /log/:code? /log2/:code? /clear/:code? ' +
                      '/testing /nothing'
                    ).split(' ')}>
                    <Twilio>
                      <Switch>
                      <Route path="/entry/:code"><ShowtimeCheck/></Route>
                      <Route path="/show/:code?"><Show/></Route>
                      <Route path="/test/:code?"><Entry test/></Route>
                      <Route path="/rejected"><Rejected/></Route>
                      <PrivateRoute path="/ninja/:code?" roles="operator" component={Entry}/>

                      <PrivateRoute path="/lurk/:code?" roles="lurker|foh|operator">
                        <AutoJoin role="lurker"/>
                        <UnstaffedRoomCheck>
                          <WithFacts><Broadcast/></WithFacts>
                        </UnstaffedRoomCheck>
                      </PrivateRoute>

                      <PrivateRoute path="/foh/:code?" roles="foh|operator" component={FOH}/>

                      <PrivateRoute path="/operator/:code?" roles="operator">
                        <AutoJoin role="operator"/><Operator/>
                      </PrivateRoute>
                      <PrivateRoute path="/focus/:code?" roles="operator">
                        <AutoJoin role="focus"/><FocusGroup/>
                      </PrivateRoute>
                      <PrivateRoute path="/gallery/:code?" roles="operator">
                        <AutoJoin role="gallery" options={{ maxTracks: '0' }}/>
                        <HalfGallery/>
                      </PrivateRoute>
                      <PrivateRoute path="/log/:code?" roles="operator">
                        <Log/>
                      </PrivateRoute>
                      <PrivateRoute path="/log2/:code?" roles="operator">
                        <Log2/>
                      </PrivateRoute>
                      <PrivateRoute path="/clear/:code?" roles="operator">
                        <ClearRoom/>
                      </PrivateRoute>

                      <PrivateRoute path="/testing/:code?" roles="operator"><Testing/></PrivateRoute>
                      <Redirect to="/" />
                      </Switch>
                    </Twilio>
                  </Route>

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

