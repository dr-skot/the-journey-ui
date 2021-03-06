import React, { ReactNode, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';
import GainControl from './GainControl';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import { getRole } from '../../utils/twilio';
import MuteAllButton from './MuteAllButton';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import DoorControls from './DoorControls/DoorControls';
import DelayControl from './DelayControl';

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
    loadingSpinner: {
      marginLeft: '1em',
    },
  })
);

interface MenuBarProps {
  extras?: ReactNode,
}
export default function MenuBar({ extras }: MenuBarProps) {
  const classes = useStyles();
  const [{ room, roomStatus }] = useContext(TwilioRoomContext);
  const [isFullScreen] = useFullScreenToggle();

  if (isFullScreen) return null;

  const role = getRole(room?.localParticipant) || '';

  return (
      <AppBar className={classes.container}>
        <Toolbar className={classes.toolbar}>
          {(roomStatus === 'connecting') && <CircularProgress className={classes.loadingSpinner}/>}
          <div className={classes.rightButtonContainer}>
            { extras }
            { role === 'foh' && <DoorControls/> }
            { role === 'operator' && roomStatus === 'connected' && <><DelayControl/><GainControl/><MuteAllButton/></> }
            <ToggleFullscreenButton />
          </div>
        </Toolbar>
      </AppBar>
    );
}
