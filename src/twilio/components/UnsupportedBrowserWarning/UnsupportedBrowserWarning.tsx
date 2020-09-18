import React from 'react';
import Video from 'twilio-video';
import { Container, Link, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isFirefox } from  'react-device-detect';

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

export default function({ children }: { children: React.ReactElement }) {
  const classes = useStyles();

  if (!Video.isSupported || isFirefox || !Array.prototype.flatMap) {
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
