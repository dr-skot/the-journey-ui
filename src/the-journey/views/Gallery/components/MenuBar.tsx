import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../../../components/MenuBar/Menu/Menu';
import { v4 as uuidv4 } from 'uuid';
import { isDev } from '../../../utils/react-help';
import DelayControl from './DelayControl';
import useRoomJoiner from '../../../hooks/useRoomJoiner';
import { AppContext } from '../../../contexts/AppContext';


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
  view: string;
}

// TODO don't use a prop for this it causes rerenders; maybe use userType in AppContext instead
export default function MenuBar({ view }: MenuBarProps) {
  const classes = useStyles();
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const [identity, setIdentity] = useState('');
  const isOperator = view === 'operator';

  console.log('MenuBar! render', { isOperator, roomStatus  });

  // TODO where should these live?
  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'gallery'

  // TODO use admin and joiner adds uniqId to all names
  useEffect(() => { setIdentity(`admin-${uuidv4()}`) }, []);

  useEffect(() => {
    if (identity) dispatch('joinRoom', { roomName, identity, subscribeProfile });
  }, [identity]);

  return (
      <AppBar className={classes.container} position="static">
        <Toolbar className={classes.toolbar}>
          {(roomStatus === 'connecting') && <CircularProgress className={classes.loadingSpinner} />}
          <div className={classes.rightButtonContainer}>
            { isOperator && roomStatus === 'connected' && <DelayControl /> }
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
MenuBar.whyDidYouRender = true;
