import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';

import useIsUserActive from './useIsUserActive/useIsUserActive';
import { AppContext } from '../../contexts/AppContext';
import SettingsButton from './SettingsButton/SettingsButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      position: 'absolute',
      right: '50%',
      transform: 'translate(50%, 30px)',
      bottom: '50px',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',
      maxWidth: 'min-content',
      '&.showControls, &:hover': {
        transition: 'opacity 0.6s, transform 0.6s, visibility 0s',
        opacity: 1,
        visibility: 'visible',
        transform: 'translate(50%, 0px)',
      },
      [theme.breakpoints.down('xs')]: {
        bottom: `${theme.sidebarMobileHeight + 3}px`,
      },
    },
  })
);

export default function Controls() {
  const classes = useStyles();
  const [{ roomStatus }] = useContext(AppContext);
  const isReconnecting = roomStatus === 'connecting';
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomStatus === 'disconnected';

  return (
    <div className={clsx(classes.container, { showControls })}>
      <ToggleAudioButton disabled={isReconnecting} />
      { /* <ToggleVideoButton disabled={isReconnecting} /> */ }
      <SettingsButton />
    </div>
  );
}
