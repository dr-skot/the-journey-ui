import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppContext } from '../../contexts/AppContext';
import DelayControl from './DelayControl';
import GainControl from './GainControl';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import { getRole } from '../../utils/twilio';
import AdmitAllButton from './AdmitAllButton';
import MuteAllButton from './MuteAllButton';

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

export default function MenuBar() {
  const classes = useStyles();
  const [{ room, roomStatus }] = useContext(AppContext);

  const role = getRole(room?.localParticipant) || '';

  return (
      <AppBar className={classes.container}>
        <Toolbar className={classes.toolbar}>
          {(roomStatus === 'connecting') && <CircularProgress className={classes.loadingSpinner}/>}
          <div className={classes.rightButtonContainer}>
            { role === 'operator' && roomStatus === 'connected' && <><DelayControl/><GainControl/></> }
            { role === 'foh' && <AdmitAllButton />}
            { role.match(/foh|operator/) && <MuteAllButton />}
            <ToggleFullscreenButton />
          </div>
        </Toolbar>
      </AppBar>
    );
}