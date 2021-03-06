import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';

import RoomJoinForm from './RoomJoinForm';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import FlipCameraButton from '../../../components/MenuBar/FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from '../../../components/MenuBar/DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from '../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import SettingsButton from '../../../components/MenuBar/SettingsButton/SettingsButton';
import { defaultRoom, UserRole } from '../../../utils/twilio';
import { Settings } from '../../../contexts/settings/settingsReducer';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      flex: '0 1 auto',
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
  })
);

interface SignInBarProps {
  roomName?: string,
  role?: UserRole,
  options?: Partial<Settings>
}

export default function SignInBar({ roomName = defaultRoom(), role = 'audience', options }: SignInBarProps) {
  const classes = useStyles();
  const [{ roomStatus }] = useContext(TwilioRoomContext)

  return (
    <AppBar className={classes.container} position="fixed">
      <Toolbar className={classes.toolbar}>
        { roomStatus === 'disconnected'
          ? <RoomJoinForm roomName={roomName} role={role} options={options} />
          : <h3>The Journey</h3> }
        <div className={classes.rightButtonContainer}>
          <FlipCameraButton />
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <SettingsButton />
        </div>
      </Toolbar>
    </AppBar>
  );
}
