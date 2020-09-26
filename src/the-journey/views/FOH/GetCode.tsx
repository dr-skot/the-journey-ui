import React, { useState, FormEvent } from 'react';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, styled, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TimezonePicker from '../../components/TimezonePicker/TimezonePicker';
import { timeToCodeWithTZ, timezones } from '../../utils/foh';
import { isDev } from '../../utils/react-help';
import { DateTime } from 'luxon';
import { serverNow } from '../../utils/ServerDate';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';



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
  h4: {
    marginBottom: 0,
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

function initialTime() {
  return serverNow().set({ hour: 20, minute: 0 }).toJSDate();
}

function minTime() {
  return serverNow().minus({ days: 2 }).set({ hour: 0, minute: 0 }).toJSDate();
}

function maxTime() {
  return serverNow().plus({ years: 1 }).set({ hour: 0, minute: 0 }).toJSDate();
}

const BASE_URL = isDev() ? 'http://localhost:3000' : 'https://thejourney-show.com' //`https://${window.location.hostname}`;

export default function GetCode() {
  const classes = useStyles();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timezone, setTimezone] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(initialTime());

  const resetCode = () => {
    setCode('');
    setError('');
  }

  const handleDateChange = (date: MaterialUiPickersDate) => {
    setSelectedDate(date as Date);
    resetCode();
  }

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const date = DateTime.fromJSDate(selectedDate)
      .setZone(timezone, { keepLocalTime: true });
    const tzIndex = timezones.indexOf(timezone);
    setCode(date.isValid ? timeToCodeWithTZ(date.toJSDate(), tzIndex) : '');
    setError(date.isValid ? '' : 'Invalid Date');
  };

  function link(path: string) {
    const url = `${BASE_URL}/${path}/${code}`;
    return <a href={url}>{url}</a>;
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="center" alignItems="flex-start" className={classes.container}>
          <Paper className={classes.paper} elevation={6}>
            <Grid container alignItems="center" direction="column">
                <Item>
                <h3>Enter Showtime:</h3>
                <DateTimePicker
                  style={{ width: 210 }} // TODO why is this necessary
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={minTime()}
                  maxDate={maxTime()}
                />
                <div><TimezonePicker id="timezone" onChange={handleTimezoneChange} /></div>
                </Item>
                { error && (
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
                { code && <>
                    <Item>
                      <h4 className={classes.h4}>Show code</h4>
                      <Typography>{code}</Typography>

                      <h4 className={classes.h4}>Audience entry</h4>
                      <Typography>{link('entry')}</Typography>

                      <h4 className={classes.h4}>Front of House</h4>
                      <Typography>{link('foh')}</Typography>

                      <h4 className={classes.h4}>Lurk</h4>
                      <Typography>
                        {link('lurk')}
                      </Typography>
                    </Item>
                  </> }
              </Grid>
          </Paper>
        </Grid>
      </form>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
