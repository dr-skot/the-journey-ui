import React, { ChangeEvent, useState, FormEvent } from 'react';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, styled, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { timeToCode } from '../../utils/foh';
import { isDev } from '../../utils/react-help';

const Item = styled('div')(() => ({
  margin: '1em',
}));

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '460px',
    padding: '2em',
    marginTop: '4em',
    background: 'white',
    color: 'black',
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
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

function defaultTime() {
  const result = moment().set('hour', 20).set('minutes', 0).format('YYYY-MM-DDTHH:mm');
  console.log('defaultTime', result);
  return result;
}

const BASE_URL = isDev() ? 'http://localhost:3000' : `https://${window.location.hostname}`;

export default function GetCode() {
  const classes = useStyles();
  const [, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setCode('');
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    // @ts-ignore
    const input = form.elements['showtime'].value;
    console.log(input);
    const date = moment(input);
    setCode(date.isValid() ? timeToCode(date.toDate()) : '');
    setError(date.isValid() ? '' : 'Invalid Date');
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="center" alignItems="flex-start" className={classes.container}>
          <Paper className={classes.paper} elevation={6}>
            <Grid container alignItems="center" direction="column">
              <Item>
                <h3>Enter Showtime:</h3>
              <TextField
                id="showtime"
                type="datetime-local"
                defaultValue={defaultTime()}
                onChange={handleChange}
              />
            </Item>
                {error && (
                  <Item>
                  <Typography variant="caption" className={classes.errorMessage}>
                    <ErrorOutlineIcon />
                    {error}
                  </Typography>
                  </Item>
                )}
          <Item>
              <Button type="submit" color="primary" variant="contained">
                Get Code
              </Button>
          </Item>
              { code &&
                <>
              <Item>
                <h4>
                  Show code
                </h4>
                <Typography>
                  {code}
                </Typography>
                  <h4>
                    Show link
                  </h4>
                  <Typography>
                    {`${BASE_URL}/show/${code}`}
                  </Typography>
                <h4>
                  Front of House
                </h4>
                <Typography>
                  {`${BASE_URL}/foh/holding/${code}`}
                </Typography>
                <h4>
                  Operator
                </h4>
                <Typography>
                  {`${BASE_URL}/operator/${code}`}
                </Typography>
                <h4>
                  Gallery
                </h4>
                <Typography>
                  {`${BASE_URL}/gallery/${code}`}
                </Typography>
                </Item>
              </>
              }
            </Grid>
          </Paper>
        </Grid>
      </form>
    </ThemeProvider>
  );
}
