import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../MenuBar/Menu/Menu';
import { v4 as uuidv4 } from 'uuid';
import { isDev } from '../../utils/react-help';
import useSubscriber from '../../hooks/useSubscriber/useSubscriber';
import DelayControl from './DelayControl';


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

interface MenuBarProps {
  isOperator?: boolean;
}

export default function MenuBar({ isOperator }: MenuBarProps) {
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();
  const [tryingToJoin, setTryingToJoin] = useState(false);
  const classes = useStyles();
  const subscribe = useSubscriber();

  const roomName = isDev() ? 'dev-room' : 'room';

  useEffect(() => {
    if (roomState === 'disconnected' && !isConnecting && !isFetching && !isAcquiringLocalTracks && !tryingToJoin) {
      setTryingToJoin(true);
      const name = isOperator ? 'admin-user' : `admin-${uuidv4()}`
      getToken(name, roomName)
        .then(token => connect(token))
        // TODO maybe this subscribe happens later on Gallery page
        .then(newRoom => subscribe(roomName, name,'gallery'))
        .then((result) => console.log(result))
        .then(() => setTryingToJoin(false))
        .catch((error) => console.log(error));
    }
  }, [roomState, isConnecting, isFetching, isAcquiringLocalTracks, user, tryingToJoin, connect, getToken, isOperator, roomName, subscribe]);

  return (
      <AppBar className={classes.container} position="static">
        <Toolbar className={classes.toolbar}>
          {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          <div className={classes.rightButtonContainer}>
            { isOperator && roomState === 'connected' && <DelayControl /> }
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
