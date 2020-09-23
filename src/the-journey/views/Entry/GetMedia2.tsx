import { Button, Checkbox, FormControlLabel, styled } from '@material-ui/core';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import AudioInputList from './components/AudioInputList';
import VideoInputList from './components/VideoInputList';
import MiniVideoPreview from './components/MiniVideoPreview';
import LocalAudioLevelIndicator from './components/LocalAudioLevelIndicator';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { getUsername } from '../../utils/twilio';

const Center = styled('div')({
  textAlign: 'center',
});
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
    marginTop: '2em',
    background: 'black',
    color: 'white',
  },
  button: {
    margin: '1em',
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
  },
  listSection: {
    margin: '2em 0',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
  mediaContainer: {
    position: 'relative',
    border: '1px solid gray',
  },
  levelIndicator: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
  }
});

interface GetMediaProps {
  onAllGood: () => void,
  onNeedHelp: () => void,
}

export default function GetMedia({ onAllGood, onNeedHelp }: GetMediaProps) {
  const classes = useStyles();
  const [{ room }] = useTwilioRoomContext();
  const [consentGiven, setConsentGiven] = useState(false);
  const [count, setCount] = useState(0);

  const name = getUsername(room?.localParticipant.identity || '');

  return <>
    <Grid container justify="center" alignItems="flex-start" className={classes.container}>
      <Paper className={classes.paper} elevation={6}>
      <Center>
          <h2>Welcome, {name}!<br/>Let's get your camera and mic ready.</h2>
        <Button onClick={() => setCount(count + 1)}>next</Button>
      </Center>
        { count > 0 && <>
          <div className={classes.mediaContainer}>
            <MiniVideoPreview/>
            <div className={classes.levelIndicator}><LocalAudioLevelIndicator/></div>
          </div>
          <Center>
            You should see yourself above,<br/>
            and the mic icon should turn green when you talk.<br/>
            ...if not, try the menus below.
          </Center>
        </> }
        <div>
          { count > 1 &&
          <div className={classes.listSection}>
            <AudioInputList />
          </div> }
          { count > 2 && <div className={classes.listSection}>
            <VideoInputList />
          </div> }
        </div>
        <Center>
          If everything looks good,<br/>
          click the checkbox and the all good button!
        </Center>
          <FormControlLabel
            control={<Checkbox checked={consentGiven} onChange={() => setConsentGiven(!consentGiven)} />}
            label="I consent to the use of my camera and mic"
          />
          <div>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!consentGiven}
            onClick={onNeedHelp}
          >
            I need help
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!consentGiven}
            onClick={onAllGood}
          >
            All good
          </Button>
        </div>
      </Paper>
    </Grid>
  </>
}

export function ThatsAll() {
  const classes = useStyles();
  return (<Grid container justify="center" alignItems="flex-start" className={classes.container}>
    <Paper className={classes.paper} elevation={6}>
      <Center>
        <h2>That's all there is to it!</h2>
      </Center>
      <Center>
        We'll see you at the show.
      </Center>
    </Paper>
  </Grid>);
}

export function PleaseEmail() {
  const classes = useStyles();

  return (<Grid container justify="center" alignItems="flex-start" className={classes.container}>
    <Paper className={classes.paper} elevation={6}>
      <Center>
        <h2>Sorry you're having trouble...</h2>
      </Center>
      <Center>
        Please email us at<br/>
        <a style={{ color: 'white' }} href="mailto:help@thejourney-show.com">
          help@thejourney-show.com
        </a><br/>
        and let us know what the issue is.
      </Center>
    </Paper>
  </Grid>);
}
