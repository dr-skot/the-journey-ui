import React from 'react';
import { SnackbarContent } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  snackbar: {
    backgroundColor: '#6db1ff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

interface NotificationProps {
  message: string,
  open: boolean,
}
export default function Notification({ message, open }: NotificationProps) {
  const classes = useStyles();

  return <>
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open}>
      <SnackbarContent
        className={classes.snackbar}
        message={
          <span className={classes.message}>
            {message}
          </span>
        }
      />
    </Snackbar>
  </>
}

