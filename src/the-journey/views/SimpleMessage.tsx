import React, { ReactNode } from 'react';
import { Container, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { listKey } from '../utils/react-help';

const useStyles = makeStyles({
  container: {
    marginTop: '2.5em',
  },
  paper: {
    padding: '1em',
  },
  heading: {
    marginBottom: '0.4em',
    textAlign: 'center',
  },
  paragraph: {
    '& a': {
      color: 'inherit',
    }
  }
});

interface SimpleMessageProps {
  title: string,
  paragraphs?: (string | ReactNode)[],
}

export default function SimpleMessage({ title, paragraphs = [] }: SimpleMessageProps) {
  const classes = useStyles();
    return (
      <Container>
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.heading}>
                { title }
              </Typography>
              { paragraphs.map((paragraph, i) => (
                <Typography key={listKey('paragraph', i)} className={classes.paragraph}>
                  { paragraph }
                </Typography>
              )) }
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
}
