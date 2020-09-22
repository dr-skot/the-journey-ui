import React from 'react';
import Video from 'twilio-video';
import { Container, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    marginTop: '2.5em',
  },
  paper: {
    padding: '1em',
  },
  heading: {
    marginBottom: '0.4em',
  },
});

function supportsVideoType(type: string) {
  let video;

  // Allow user to create shortcuts, i.e. just "webm"
  let formats: Record<string, string> = {
    ogg: 'video/ogg; codecs="theora"',
    h264: 'video/mp4; codecs="avc1.42E01E"',
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp8: 'video/webm; codecs="vp8"',
    vp9: 'video/webm; codecs="vp9"',
    hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
  };

  if(!video) {
    video = document.createElement('video')
  }

  return video.canPlayType?.(formats[type] || type);
}

export default function({ children }: { children: React.ReactElement }) {
  const classes = useStyles();

  if (!Video.isSupported || !supportsVideoType('vp8') || !Array.prototype.flatMap) {
    return (
      <Container>
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.heading}>
                Uh oh! This browser isn&rsquo;t supported
              </Typography>
              <Typography>
                The Journey is best experienced in the latest versions of Chrome, Edge, and Safari.
                Please revisit us using one of those. Thank you and sorry for the inconvenience!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return children;
}
