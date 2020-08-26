import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '../MenuBar/Menu/Menu';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import FlipCameraButton from '../MenuBar/FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from '../MenuBar/DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
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
  const classes = useStyles();
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();
  const [tryingToJoin, setTryingToJoin] = useState(false);

  const [name, setName] = useState<string>(user?.displayName || '');
  const roomName = 'room';

  useEffect(() => {
    if (roomState === 'disconnected' && !isConnecting && !isFetching && !isAcquiringLocalTracks && !tryingToJoin) {
      console.log('join gallery', count++, { roomState, isConnecting, isFetching, isAcquiringLocalTracks, user });
      setTryingToJoin(true);
      getToken('adkfadf', roomName).then(token => connect(token)).then(() => setTryingToJoin(false)).catch(() => setTryingToJoin(false));
    }
  }, [roomState, isConnecting, isFetching, isAcquiringLocalTracks]);

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar className={classes.toolbar}>
        { roomState === 'disconnected'
          ? (isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />
          : <h3>{roomName}</h3> }
        <div className={classes.rightButtonContainer}>
          <FlipCameraButton />
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
