import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import generateConnectionOptions from './utils/generateConnectionOptions/generateConnectionOptions';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import MockGallery from './components/MockGallery/Gallery';

const VideoApp = () => {
  const { error, setError, settings } = useAppState();
  const connectionOptions = generateConnectionOptions(settings);
  const { view } = useParams()

  console.log('render VideoApp', { connectionOptions, view, error, setError, settings });

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError} lurk={view === 'gallery' || view === 'operator'}>
        { /* TODO reinstate error reporting */ }
        { /* <ErrorDialog dismissError={() => setError(null)} error={error} /> */ }
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

console.log('ReoctDOM.render');
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
          <PrivateRoute path="/:view">
            <VideoApp />
          </PrivateRoute>
            <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute>
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
