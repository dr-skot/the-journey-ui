import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FlipCameraButton from '../MenuBar/FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from '../MenuBar/DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from '../MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../MenuBar/Menu/Menu';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      position: 'fixed',
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
  })
);

let count = 0;

export default function MenuBar() {
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();
  const [tryingToJoin, setTryingToJoin] = useState(false);
  const classes = useStyles();

  const roomName = 'room';

  useEffect(() => {
    if (roomState === 'disconnected' && !isConnecting && !isFetching && !isAcquiringLocalTracks && !tryingToJoin) {
      console.log('join gallery', count++, { roomState, isConnecting, isFetching, isAcquiringLocalTracks, user });
      setTryingToJoin(true);
      getToken('admin-user', roomName).then(token => connect(token)).then(() => setTryingToJoin(false));
    }
  }, [roomState, isConnecting, isFetching, isAcquiringLocalTracks, user, tryingToJoin, connect, getToken]);

  return (
      <AppBar className={classes.container} position="static">
        <Toolbar className={classes.toolbar}>
          {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          <div className={classes.rightButtonContainer}>
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
