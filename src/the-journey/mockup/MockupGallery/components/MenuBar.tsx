import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DelayControl from './DelayControl';
import GainControl from './GainControl';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToggleFullscreenButton from '../../../components/MenuBar/ToggleFullScreenButton/ToggleFullScreenButton';
import Menu from '../../../components/MenuBar/Menu/Menu';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
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
  })
);

interface MenuBarProps {
  isOperator?: boolean;
}

// TODO don't use a prop for this it causes rerenders; maybe use userType in AppContext instead
export default function MenuBar({ isOperator }: MenuBarProps) {
  const classes = useStyles();

  return (
      <AppBar className={classes.container} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.rightButtonContainer}>
            <DelayControl/><GainControl/>
            <ToggleFullscreenButton />
            <Menu />
          </div>
        </Toolbar>
      </AppBar>
    );
}
