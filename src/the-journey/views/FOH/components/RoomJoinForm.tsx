import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { AppContext } from '../../../contexts/AppContext';
import { UserRole, SubscribeProfile } from '../../../utils/twilio';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

interface RoomJoinFormProps {
  roomName: string,
  role?: UserRole,
  subscribeProfile?: SubscribeProfile,
}

export default function RoomJoinForm({ roomName, role = 'audience', subscribeProfile = 'data-only' }: RoomJoinFormProps) {
  const classes = useStyles();
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const [username, setUsername] = useState<string>('');

  // TODO autofill remembered identity

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch('joinRoom', { roomName, role, username: username, subscribeProfile });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="menu-name"
          label="Name"
          className={classes.textField}
          value={username}
          onChange={handleNameChange}
          margin="dense"
        />
      <Button
        className={classes.joinButton}
        type="submit"
        color="primary"
        variant="contained"
        disabled={roomStatus === 'connecting' || username.trim().length === 0}
      >
        Enter
      </Button>
      { roomStatus === 'connecting' && <CircularProgress className={classes.loadingSpinner} /> }
    </form>
  )
}
