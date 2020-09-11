import React, { useCallback, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import { useAppContext } from '../../../contexts/AppContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleVideoButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const [{ localTracks }, dispatch] = useAppContext();
  const isVideoEnabled = localTracks.some(track => track.name.includes('camera'));
  const lastClickTimeRef = useRef(0);

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 200) {
      lastClickTimeRef.current = Date.now();
      dispatch('toggleVideoEnabled');
    }
  }, [dispatch]);

  return (
    <Tooltip
      title={isVideoEnabled ? 'Mute Video' : 'Unmute Video'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab className={classes.fab} onClick={toggleVideo} disabled={props.disabled}>
        {isVideoEnabled ? <Videocam /> : <VideocamOff />}
      </Fab>
    </Tooltip>
  );
}
