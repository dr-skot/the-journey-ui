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
import { useAppState } from '../../contexts/AppStateContext';
import SafeRedirect from '../../components/SafeRedirect';
import { Messages } from '../../messaging/messages';
import { useLocalTracks } from '../../hooks/useLocalTracks';

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
  },
});

export default function GetMedia({ test }: { test?: boolean }) {
  const classes = useStyles();
  const [{ room, mediaPermissionDenied }] = useTwilioRoomContext();
  const [, roomStateDispatch] = useAppState();
  const [consentGiven, setConsentGiven] = useState(false);
  const [status, setStatus] = useState<'needHelp' | 'allGood'>();
  const name = getUsername(room?.localParticipant.identity || '');
  const localTracks = useLocalTracks();

  console.log('GetMedia', localTracks);

  if (status) return test
    ? status === 'allGood' ? Messages.TEST_SORRY : Messages.TEST_ALL_GOOD
    : <SafeRedirect push to="/show"/>;

  return <>
    <Grid container justify="center" alignItems="flex-start" className={classes.container}>
      <Paper className={classes.paper} elevation={6}>
        { mediaPermissionDenied
          ? <>
            <Center>
              <h2>Welcome, {name}!<br/></h2>
            </Center>
            <Center>
              <h3>It looks like we don’t have permission to use your camera and microphpone.</h3>
            </Center>
            <Center>
              For the full experience, please adjust your browser permissions.
            </Center>
            <div>
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => window.location.reload()}
              >
                I've fixed the permissions
              </Button>
            </div>
          </>
          : <>
            <Center>
              <h2>Welcome, {name}!<br/>Let’s get your camera and mic ready.</h2>
            </Center>
            <div className={classes.mediaContainer}>
              <MiniVideoPreview/>
              <div className={classes.levelIndicator}><LocalAudioLevelIndicator /></div>
            </div>
            <Center>
              You should see yourself above,<br/>
              and the mic icon should turn green when you talk.<br/>
              If not, try the menus below.
            </Center>
            <div>
              <div className={classes.listSection}>
                <AudioInputList />
              </div>
              <div className={classes.listSection}>
                <VideoInputList />
              </div>
            </div>
            <Center>
              If everything looks good,<br/>
              click the checkbox and the all good button!
            </Center>
            <FormControlLabel
              control={<Checkbox checked={consentGiven} onChange={() => setConsentGiven(!consentGiven)} />}
              label="I consent to the use of my camera and mic"
            />
            <Center>
              (While your camera is on, our staff can see you,<br/>
              and your image may appear in the show.)
            </Center>
          </>
        }
        <div>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!consentGiven && !mediaPermissionDenied}
            onClick={() => {
              if (!test) roomStateDispatch('setMembership', { group: 'helpNeeded', value: true });
              setStatus('needHelp');
            }}
          >
            Help
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!consentGiven && !mediaPermissionDenied}
            onClick={() => {
              if (!test) roomStateDispatch('setMembership', { group: 'helpNeeded', value: false });
              setStatus('allGood')
            }}
          >
            { mediaPermissionDenied ? 'just watch': 'all good' }
          </Button>
        </div>
      </Paper>
    </Grid>
  </>
}



