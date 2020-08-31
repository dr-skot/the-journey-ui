import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { isDev } from '../../../utils/react-help';
import { AppContext } from '../../../contexts/AppContext';

import RoomJoinForm from './RoomJoinForm';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '../../../components/MenuBar/Menu/Menu';
// import FlipCameraButton from '../../../components/MenuBar/FlipCameraButton/FlipCameraButton';
// import LocalAudioLevelIndicator from '../../../components/MenuBar/DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
// import ToggleFullscreenButton from '../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      opacity: '75%',
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

export default function MenuBar() {
  const classes = useStyles();
  const [{ roomStatus }] = useContext(AppContext)

  console.log('MenuBar: room status', roomStatus);

  // TODO make these props
  // TODO reinstate buttons & menu

  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'data-only';

  return (
    <AppBar className={classes.container} position="fixed">
      <Toolbar className={classes.toolbar}>
        { roomStatus === 'disconnected'
          ? <RoomJoinForm roomName={roomName} subscribeProfile={subscribeProfile} /> : <h3>The Journey</h3> }
        <div className={classes.rightButtonContainer}>
          { /* <FlipCameraButton />
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton /> */ }
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
