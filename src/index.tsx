import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import generateConnectionOptions from './utils/generateConnectionOptions/generateConnectionOptions';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import MockGallery from './components/MockGallery/Gallery';
import Gallery from './components/Gallery/Gallery';

const VideoApp = () => {
  const { error, setError, settings } = useAppState();
  const connectionOptions = generateConnectionOptions(settings);

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <VideoApp />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <VideoApp />
          </PrivateRoute>
          <Route path="/mockup/gallery">
            <MockGallery />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
