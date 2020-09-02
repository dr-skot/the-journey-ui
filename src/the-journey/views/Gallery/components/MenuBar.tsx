import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isDev } from '../../../utils/react-help';
import { AppContext } from '../../../contexts/AppContext';
import DelayControl from '../../Operator/components/DelayControl';
import GainControl from '../../Operator/components/GainControl';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from '../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../../../components/MenuBar/Menu/Menu';
import { unixTime } from '../../../utils/functional';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      flex: '0 1 auto',
      position: 'relative'
    },
    toolbar: {
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

// TODO don't use a prop for this it causes rerenders; maybe use userType in AppContext instead
export default function MenuBar({ isOperator }: MenuBarProps) {
  const classes = useStyles();
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const [identity, setIdentity] = useState('');

  // TODO where should these live?
  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'gallery'

  // TODO joiner adds uniqId to all names (could be timestamp instead of uuid)
  useEffect(() => { setIdentity(isOperator ? 'operator' : `gallery-${unixTime()}`) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);  // just once

  useEffect(() => {
    if (identity) dispatch('joinRoom', { roomName, identity, subscribeProfile });
  }, [roomName, identity, subscribeProfile, dispatch]);

  return (
      <AppBar className={classes.container}>
        <Toolbar className={classes.toolbar}>
          {(roomStatus === 'connecting') && <CircularProgress className={classes.loadingSpinner}/>}
          <div className={classes.rightButtonContainer}>
            { isOperator && roomStatus === 'connected' && <><DelayControl/><GainControl/></> }
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
