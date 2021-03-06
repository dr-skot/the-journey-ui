import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './the-journey/components/Auth/PrivateRoute';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import TwilioRoomContextProvider, { useTwilioRoomContext } from './the-journey/contexts/TwilioRoomContext';
import { getUsername } from './the-journey/utils/twilio';
import AppStateContextProvider from './the-journey/contexts/AppStateContext';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Rejected from './the-journey/views/Entry/Rejected';
import Testing from './the-journey/views/Testing/Testing';
import FocusGroup from './the-journey/views/Focus/FocusGroup';
import FOH from './the-journey/views/FOH/FOH';
import Operator from './the-journey/views/Operator/Operator';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './the-journey/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Log from './the-journey/views/Log/Log';
import ShowtimeCheck from './the-journey/views/Entry/ShowtimeCheck';
import HomePage from './the-journey/views/HomePage';
import ClearRoom from './the-journey/views/Operator/ClearRoom';
import Entry from './the-journey/views/Entry/Entry';
import Log2 from './the-journey/views/Log/Log2';
import Show from './the-journey/views/Entry/Show';
import PopulateDemo from './the-journey/views/Gallery/PopulateDemo';
import TwilioMin from './the-journey/views/Testing/TwilioMin';
import FocusGroup2 from './the-journey/views/Focus/FocusGroup2';
import Lurk from './the-journey/views/Entry/Lurk';
import Lurk2 from './the-journey/views/Entry/Lurk2';
import Sender from './the-journey/views/Testing/Sender';
import AudioTest from './the-journey/views/Testing/AudioTest';
import Receiver from './the-journey/views/Testing/Receiver';

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
          <AppStateContextProvider>
            <ReconnectingNotification />
            { children }
          </AppStateContextProvider>
      </TwilioRoomContextProvider>
    </UnsupportedBrowserWarning>
  );
}


export default function App() {
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
            <Route path="/audio" component={AudioTest}/>
            <Route path="/sender" component={Sender}/>
            <Route path="/receiver" component={Receiver}/>

            <PrivateRoute path="/code" roles="foh|operator">
              <GetCode/>
            </PrivateRoute>

            <Route exact path="/" component={HomePage}/>
            <Route
              path={(
                '/entry/:code /show/:code? /test/:code? /rejected/:code? ' +
                '/ninja/:code? /lurk/:code? /foh/:code? /operator/:code? /focus/:code? ' +
                '/gallery/:code? /log/:code? /log2/:code? /clear/:code? /focus2/:code?  ' +
                '/testing /nothing'
              ).split(' ')}>
              <Twilio>
                <Switch>
                  <Route path="/entry/:code"><ShowtimeCheck/></Route>
                  <Route path="/show/:code?"><Show/></Route>
                  <Route path="/test/:code?"><Entry test/></Route>
                  <Route path="/rejected"><Rejected/></Route>
                  <PrivateRoute path="/ninja/:code?" roles="operator"><Entry/></PrivateRoute>

                  <PrivateRoute path="/lurk/:code?" roles="lurker|foh|operator">
                    <Lurk/>
                  </PrivateRoute>

                  <PrivateRoute path="/lurk2/:code?" roles="lurker|foh|operator">
                    <Lurk2/>
                  </PrivateRoute>

                  <PrivateRoute path="/foh/:code?" roles="foh|operator" component={FOH}/>

                  <PrivateRoute path="/operator/:code?" roles="operator">
                    <AutoJoin role="operator"/><Operator/>
                  </PrivateRoute>
                  <PrivateRoute path="/focus/:code?" roles="operator">
                    <AutoJoin role="focus"/><FocusGroup/>
                  </PrivateRoute>
                  <PrivateRoute path="/focus2/:code?" roles="operator">
                    <AutoJoin role="focus"/><FocusGroup2/>
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

/* TODO reinstate this?
const VideoAppFull = React.memo(({ view }: VideoAppProps) => {
  const { error, setError, settings } = useAppState();

  return (
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
  );
});
 */

