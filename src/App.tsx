import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider, styled } from '@material-ui/core/styles';

import AppContextProvider from './the-journey/contexts/AppContext';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import FixedGallery from './the-journey/views/Gallery/FixedGallery';
import Operator from './the-journey/views/Operator/Operator';
//import MockupGallery from './the-journey/mockup/MockupGallery/Gallery';

import FocusGroupStreamSources from './the-journey/components/audio/FocusGroupStreamSources';
// import Controls from './twilio/components/Controls/Controls';
// import ReconnectingNotification from './twilio/components/ReconnectingNotification/ReconnectingNotification';

// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';
// import generateConnectionOptions from './twilio/utils/generateConnectionOptions/generateConnectionOptions';
// import UnsupportedBrowserWarning from './twilio/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';


import useHeight from './twilio/hooks/useHeight/useHeight';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';
import FocusGroupAudioElements from './the-journey/components/audio/FocusGroupAudioElements';
import FocusGroupElementNodes from './the-journey/components/audio/FocusGroupElementNodes';

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
            { /*<Route path="/mockup" component={MockupGallery} />*/}
            <Route path="/operator" component={Operator} />
            <Route path="/gallery" component={FixedGallery} />
            <Route path="/hybrid">
              <Broadcast style={'hybrid'}/>
            </Route>
            <Route path="/pure">
              <Broadcast style={'pure'}/>
            </Route>
            <Route component={Broadcast}/>
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

