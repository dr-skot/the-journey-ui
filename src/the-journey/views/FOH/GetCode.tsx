import React, { ChangeEvent, useState, FormEvent } from 'react';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, styled, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import TimezonePicker from '../../components/TimezonePicker/TimezonePicker';
import { timeToCodeWithTZ, timezones } from '../../utils/foh';
import { isDev } from '../../utils/react-help';
import { DateTime } from 'luxon';

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
  const result = DateTime.local().set({ hour: 20 }).set({ minute: 0 }).toFormat("yyyy-MM-dd'T'hh:mm");
  console.log('defaultTime', result);
  return result;
}

const BASE_URL = isDev() ? 'http://localhost:3000' : `https://${window.location.hostname}`;

export default function GetCode() {
  const classes = useStyles();
  const [, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timezone, setTimezone] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    resetCode();
  };

  const handleTimezoneChange = (tz: string) => setTimezone(tz);

  const resetCode = () => {
    setCode('');
    setError('');
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    // @ts-ignore
    const input = form.elements['showtime'].value;
    const tzIndex = timezones.indexOf(timezone);
    console.log(input, tzIndex);
    console.log({ input, type: typeof input })
    const date = DateTime.fromISO(input, { zone: timezone });
      setCode(date.isValid ? timeToCodeWithTZ(date.toJSDate(), tzIndex) : '');
    setError(date.isValid ? '' : 'Invalid Date');
  };

  function link(path: string) {
    const url = `${BASE_URL}/${path}/${code}`;
    return <a href={url}>{url}</a>;
  }

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
                <div><TimezonePicker id="timezone" onChange={handleTimezoneChange} /></div>

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
                    Show
                  </h4>
                  <Typography>
                    {link('show')}
                  </Typography>
                <h4>
                  Front of House
                </h4>
                <Typography>
                  {link('foh/holding')}
                </Typography>
                <h4>
                  Operator
                </h4>
                <Typography>
                  {link('operator')}
                </Typography>
                <h4>
                  Gallery
                </h4>
                <Typography>
                  {link('gallery')}
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