import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useAppState } from '../../../../twilio/state';
import useVideoContext from '../../../hooks/useVideoContext';
import useRoomJoiner from '../../../hooks/useRoomJoiner';
import { SubscribeProfile } from '../../../hooks/useTrackSubscriber';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
  subscribeProfile?: SubscribeProfile,
}

export default function RoomJoinForm({ roomName, subscribeProfile = 'data-only' }: RoomJoinFormProps) {
  const classes = useStyles();
  const { user, isFetching } = useAppState();
  const { isConnecting, isAcquiringLocalTracks } = useVideoContext();
  const [identity, setIdentity] = useState<string>(user?.displayName || '');
  const { join, joinStatus } = useRoomJoiner();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIdentity(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    join(roomName, identity, subscribeProfile);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {window.location.search.includes('customIdentity=true') || !user?.displayName ? (
        <TextField
          id="menu-name"
          label="Name"
          className={classes.textField}
          value={identity}
          onChange={handleNameChange}
          margin="dense"
        />
      ) : (
        <Typography className={classes.displayName} variant="body1">
          {user.displayName}
        </Typography>
      )}
      <Button
        className={classes.joinButton}
        type="submit"
        color="primary"
        variant="contained"
        disabled={isAcquiringLocalTracks || isConnecting || !identity || !roomName || isFetching}
      >
        Join Room
      </Button>
      {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
    </form>
  )
}
