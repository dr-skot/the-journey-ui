import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import useRoomState from '../../../../hooks/useRoomState/useRoomState';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../../../../components/MenuBar/Menu/Menu';
import { v4 as uuidv4 } from 'uuid';
import { isDev } from '../../../utils/react-help';
import DelayControl from './DelayControl';
import useRoomJoiner from '../../../hooks/useRoomJoiner';
import { useAppState } from '../../../../state';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';


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
  const roomState = useRoomState();
  const [identity, setIdentity] = useState('');
  const [tryingToJoin, setTryingToJoin] = useState(false);
  const classes = useStyles();
  const join = useRoomJoiner();

  const { isFetching } = useAppState();
  const { isConnecting, isAcquiringLocalTracks } = useVideoContext();

  // TODO roomJoiner should know when it's okay to join
  const okayToJoin = (
    identity
    && roomState === 'disconnected'
    && !tryingToJoin
    && !isFetching
    && !isConnecting
    && !isAcquiringLocalTracks
  )

  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'gallery'

  // TODO use admin and joiner adds uniqId to all names
  useEffect(() => { setIdentity(`admin-${uuidv4()}`) }, []);

  useEffect(() => {
    if (okayToJoin) {
      setTryingToJoin(true);
      join(roomName, identity, subscribeProfile)
        .finally(() => setTryingToJoin(false))
    }
  }, [okayToJoin, join, setTryingToJoin, roomName, identity, subscribeProfile]);

  return (
      <AppBar className={classes.container} position="static">
        <Toolbar className={classes.toolbar}>
          {(tryingToJoin) && <CircularProgress className={classes.loadingSpinner} />}
          <div className={classes.rightButtonContainer}>
            { isOperator && roomState === 'connected' && <DelayControl /> }
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
