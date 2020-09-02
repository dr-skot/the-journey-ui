import React, { useContext } from 'react';
import Participant from '../../../twilio/components/Participant/Participant';
import { AppContext } from '../../contexts/AppContext';
import { createStyles, makeStyles, styled, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import useIsUserActive from './useIsUserActive/useIsUserActive';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: theme.sidebarWidth,
      position: 'absolute',
      right: '50%',
      transform: 'translate(50%, 30px)',
      bottom: '150px',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',
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


export default function SelfView() {
  const classes = useStyles();
  const [{ room, roomStatus }] = useContext(AppContext);
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomStatus === 'disconnected';

  if (!room?.localParticipant) return null;

  // TODO make these attributes optional
  return (
    <div className={clsx(classes.container, { showControls })}>
      <Participant participant={room.localParticipant} onClick={() => {}} isSelected={false} disableAudio={true} />
    </div>
  )
}
