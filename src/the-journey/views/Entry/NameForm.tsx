import { Button, styled } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAppContext } from '../../contexts/AppContext';
import { UserRole } from '../../utils/twilio';
import { Settings } from '../../contexts/settings/settingsReducer';

const Center = styled('div')({
  textAlign: 'center',
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  container: {
    height: '100vh',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '460px',
    padding: '2em',
    marginTop: '2em',
    background: 'black',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  textField: {
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
}));

interface NameFormProps {
  roomName: string,
  role?: UserRole,
  options?: Partial<Settings>,
}

export default function NameForm({ roomName, role = 'audience', options= {} }: NameFormProps) {
  const classes = useStyles();
  const [{ roomStatus}, dispatch] = useAppContext();

  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');

  // TODO autofill remembered identity

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('username', username);
    dispatch('joinRoom', { roomName, role, username: username, options });
  };


  return <>
    <Grid container justify="center" alignItems="flex-start" className={classes.container}>
      <Paper className={classes.paper} elevation={6}>
      <Center>
          <h2>Welcome to The Journey</h2>
      </Center>
        <Center>
          Please enter your name<br/>
        </Center>
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
            disabled={roomStatus === 'connecting' || !username.trim() }
          >
            Enter
          </Button>
          { roomStatus === 'connecting' && <CircularProgress className={classes.loadingSpinner} /> }
        </form>
      </Paper>
    </Grid>
  </>
}
