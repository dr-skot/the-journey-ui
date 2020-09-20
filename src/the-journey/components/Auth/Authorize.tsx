import React, { ChangeEvent, FormEvent, useState } from 'react';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    height: '100vh',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '460px',
    padding: '2em',
    marginTop: '4em',
    background: 'black',
    color: 'white',
  },
  button: {
    color: 'white',
    background: 'red',
    margin: '0.8em 0 0.7em',
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
  textField: {
    color: 'black',
  }
});

interface AuthorizeProps {
  roles: string,
  onSuccess: (role: string) => void,
}

export default function Authorize({ roles, onSuccess }: AuthorizeProps) {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = JSON.stringify({ password, roles });
    fetch('/auth', { method: 'post', body: params, headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then(({ role }: { role?: string }) => {
        if (role) onSuccess(role);
        else setAuthError(new Error('Sorry...'));
      });
  }

  return (
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <Paper className={classes.paper} elevation={6}>
            <form onSubmit={handleSubmit}>
              <Grid container alignItems="center" direction="column">
                <h4>Enter password for {roles.split('|').join(' or ')}</h4>
                <TextField className={classes.textField}
                  id="input-passcode"
                  label="Password"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  type="password"
                />
                <div>
                  {authError && (
                    <Typography variant="caption" className={classes.errorMessage}>
                      <ErrorOutlineIcon />
                      {authError.message}
                    </Typography>
                  )}
                </div>
                <Button variant="contained" className={classes.button} type="submit" disabled={!password.length}>
                  Submit
                </Button>
              </Grid>
            </form>
        </Paper>
      </Grid>
  );
}
