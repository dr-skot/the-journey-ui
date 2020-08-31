import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './twilio/state';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorDialog from './twilio/components/ErrorDialog/ErrorDialog';
import generateConnectionOptions from './twilio/utils/generateConnectionOptions/generateConnectionOptions';
import LoginPage from './twilio/components/LoginPage/LoginPage';
import PrivateRoute from './twilio/components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './twilio/components/VideoProvider';
import UnsupportedBrowserWarning from './twilio/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import MockGallery from './the-journey/mockup/MockGallery/Gallery';
import AppContextProvider from './the-journey/contexts/AppContext';
import Room from './the-journey/views/Show/Room';
import MenuBar from './the-journey/views/Audience/components/MenuBar';
import Audience from './the-journey/views/Audience/Room';

interface VideoAppProps {
  view: string;
}

const VideoApp = React.memo(({ view }: VideoAppProps) => {
  const { error, setError, settings } = useAppState();
  const connectionOptions = generateConnectionOptions(settings);

  console.log('render VideoApp', { setError, settings, connectionOptions, view });

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError} lurk={view === 'gallery' || view === 'operator'}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App view={view} />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
});
VideoApp.whyDidYouRender = true;

const VideoApp2 = ({ view }: VideoAppProps) => {

  console.log('render VideoApp2');

  return (
      <AppContextProvider>
        <App view={view} />
      </AppContextProvider>
  );
};

VideoApp.whyDidYouRender = true;

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
            <Route path="/mockup/gallery">
              <MockGallery />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
          <PrivateRoute path="/operator">
            <VideoApp2 view="operator" />
          </PrivateRoute>
          <PrivateRoute path="/gallery">
            <VideoApp2 view="gallery" />
          </PrivateRoute>
            <PrivateRoute exact path="/">
              <VideoApp2 view="audience" />
            </PrivateRoute>
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
