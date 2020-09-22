import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';
import { useAppContext } from '../../../contexts/AppContext';
import { useSharedRoomState } from '../../../contexts/SharedRoomContext';
import { inGroup } from '../../../utils/twilio';

const useStyles = makeStyles({
  snackbar: {
    backgroundColor: '#6db1ff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.8em',
  },
});

export default function HelpIsComingNotification() {
  const classes = useStyles();
  const [{ room }] = useAppContext();
  const [{ helpNeeded, admitted }] = useSharedRoomState();

  const needsHelp =
    inGroup(helpNeeded)(room?.localParticipant) && !inGroup(admitted || [])(room?.localParticipant);

  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={needsHelp}>
      <SnackbarContent
        className={classes.snackbar}
        message={
          <span className={classes.message}>
            Sit tight! One of our staff will be with you shortly.
          </span>
        }
      />
    </Snackbar>
  );
}
