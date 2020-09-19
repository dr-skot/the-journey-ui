import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AppContextProvider, { useAppContext } from './the-journey/contexts/AppContext';
import Broadcast from './the-journey/views/Broadcast/Broadcast';
import useHeight from './the-journey/hooks/useHeight/useHeight';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';
import AutoJoin from './the-journey/components/AutoJoin';
import GetCode from './the-journey/views/FOH/GetCode';
import Rejected from './the-journey/views/FOH/Rejected';
import SignLanguageEntry from './the-journey/views/Broadcast/components/SignLanguageEntry';
import AudioStreamContextProvider from './the-journey/contexts/AudioStreamContext/AudioStreamContext';
import SharedRoomContextProvider from './the-journey/contexts/SharedRoomContext';
import Testing from './the-journey/views/Testing/Testing';
import FallbackToAudioElements from './the-journey/contexts/AudioStreamContext/FallbackToAudioElements';
import MinFocusGroup from './the-journey/views/Gallery/MinFocusGroup';
import { getUsername } from './the-journey/utils/twilio';
import FOH from './the-journey/views/FOH/FOH';
import BlindOperator from './the-journey/views/Operator/Operator';
import HalfGallery from './the-journey/views/Gallery/HalfGallery';
import WithFacts from './the-journey/views/Entry/WithFacts';
import ReconnectingNotification from './the-journey/components/ReconnectingNotification/ReconnectingNotification';
import UnsupportedBrowserWarning from './the-journey/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Log from './the-journey/views/Log/Log';
import FrontDoor from './the-journey/views/FOH/FrontDoor';
import Landing from './the-journey/views/Landing';

// import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';
// import generateConnectionOptions from './twilio/utils/generateConnectionOptions/generateConnectionOptions';

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
                  <Route path="/log/:code?" component={Log} />

                  <Route path="/entry/:code?" component={FrontDoor}/>
                  <Route path="/rejected" component={Rejected} />

                  <Route path="/code" component={GetCode} />
                  <Route path="/foh/:code?" component={FOH}/>

                  <Route path="/operator/:code?">
                    <AutoJoin role="operator" /><BlindOperator />
                  </Route>
                  <Route path="/focus/:code?">
                    <AutoJoin role="focus" /><MinFocusGroup />
                  </Route>
                  <Route path="/gallery/:code?">
                    <AutoJoin role="gallery" options={{ maxTracks: '0' }} /><HalfGallery />
                  </Route>

                  <Route path="/captioning/:code?" component={SignLanguageEntry} />

                  <Route path="/lurk/:code?">
                    <AutoJoin role="lurker" />
                    <WithFacts><Broadcast /></WithFacts>
                  </Route>

                  <Route path="/testing/:code?" component={Testing}/>
                  <Route path="/" component={Landing} />

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

