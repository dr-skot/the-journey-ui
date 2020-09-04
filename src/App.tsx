import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppContextProvider from './the-journey/contexts/AppContext';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import FixedGallery from './the-journey/views/Gallery/FixedGallery';
import Operator from './the-journey/views/Operator/Operator';
import MuppetOperator from './the-journey/views/Operator/MuppetOperator';
import MockupGallery from './the-journey/mockup/MockupGallery/Gallery';

import FocusGroupStreamSources from './the-journey/components/audio/FocusGroupStreamSources';
// import ReconnectingNotification from './twilio/components/ReconnectingNotification/ReconnectingNotification';

// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';
// import generateConnectionOptions from './twilio/utils/generateConnectionOptions/generateConnectionOptions';
// import UnsupportedBrowserWarning from './twilio/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

import useHeight from './twilio/hooks/useHeight/useHeight';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';
// import FocusGroupAudioElements from './the-journey/components/audio/FocusGroupAudioElements';
// import FocusGroupElementNodes from './the-journey/components/audio/FocusGroupElementNodes';
import FocusGroup from './the-journey/views/Gallery/FocusGroup';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import FrontDoor from './the-journey/views/FOH/FrontDoor';
import Holding from './the-journey/views/FOH/Holding';
import Rejected from './the-journey/views/FOH/Rejected';
import FOHEntry from './the-journey/views/FOH/FOHEntry';
import SignerEntry from './the-journey/views/Signer/SignerEntry';

export default function App() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  // TODO reinstate reconnecting notification
  // TODO reinstate controls

  return (
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
      <AppContextProvider>
       <div style={{ height }}>
        <Router>
          <Switch>
            <Route path="/rejected" component={Rejected} />
            <Route path="/mockup" component={MockupGallery} />
            <Route path="/foh/code" component={GetCode} />
            <Route path="/foh/holding/:code?" component={FOHEntry}/>
            <Route path="/signer/:code?" component={SignerEntry} />
              <Route path="/focus/:code?">
              <AutoJoin role="lurker" /><FocusGroup />
            </Route>
            <Route path="/lurk/:code?">
              <AutoJoin role="lurker" /><Broadcast />
            </Route>
            <Route path="/muppets/:code?">
              <AutoJoin role="operator" /><MuppetOperator />
            </Route>
            <Route path="/operator/:code?">
              <AutoJoin role="operator" /><Operator />
            </Route>
            <Route path="/gallery/:code?">
              <AutoJoin role="lurker" /><FixedGallery />
            </Route>
            <Route path="/hybrid/:code?">
              <AutoJoin role="audience" /><Broadcast type={'hybrid'} />
            </Route>
            <Route path="/pure/:code?">
              <AutoJoin role="audience" /><Broadcast type={'pure'} />
            </Route>
            <Route path="/show/:code?" component={FrontDoor} />
            <Redirect to="/show" />
          </Switch>
        </Router>
         { /* <ReconnectingNotification /> */ }
         <FocusGroupStreamSources />
       </div>
      </AppContextProvider>
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

