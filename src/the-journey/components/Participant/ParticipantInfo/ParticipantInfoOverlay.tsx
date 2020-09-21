import { Participant as IParticipant } from 'twilio-video';
import React, { MouseEventHandler } from 'react';
import SelectionNumber from './SelectionNumber/SelectionNumber';
import KeyIcon from './KeyIcon/KeyIcon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { muppetImage } from '../Muppet';
import { getUsername } from '../../../utils/twilio';
import FOHControls from '../../../views/FOH/components/FOHControls';
import MuteInFocusGroupButton from './MuteInFocusGroupButton/MuteInFocusGroupButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      cursor: 'pointer',
      backgroundSize: 'cover',
      '& video': {
        filter: 'none',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
      [theme.breakpoints.down('xs')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '3px',
        fontSize: '10px',
      },
    },
    borderer: {
      width: '100%',
      height: '100%',
      border: '0.5px solid black',
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '0.4em',
      width: '100%',
      background: 'transparent',
    },
    identity: {
      position: 'absolute',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'din alternate, din condensed, avenir next, roboto, arial',
      fontSize: '1.5rem',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      pointerEvents: 'none',
    },
  })
);

interface ParticipantInfoProps {
  children: React.ReactNode;
  participant: IParticipant;
  onClick?: MouseEventHandler;
  width?: number;
  height?: number;
  selectedIndex: number;
  hotKey?: string;
  foh?: boolean;
  mutable?: boolean;
}

export default function ParticipantInfoOverlay({
    participant, onClick = () => {}, selectedIndex, children, width, height, hotKey, mutable
  }: ParticipantInfoProps) {
  const classes = useStyles();

  // TODO is this ok? are users going to see muppets?
  const explicitStyle = width && height
    ? { width, height, backgroundImage: `url(${muppetImage(participant)})` }
    : {};

  // TODO add foh && to maybe not render FOHControls?
  return (
    <div
      className={classes.container}
      style={explicitStyle}
      onClick={onClick}
      data-cy-participant={participant.sid}
    >
      <div className={classes.borderer}>
      <div className={classes.infoContainer}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            {getUsername(participant.identity)}
          </h4>
        </div>
        <div>
          { mutable && <MuteInFocusGroupButton identity={participant.identity} /> }
          <FOHControls participant={participant} />
          {selectedIndex > 0 && <SelectionNumber number={selectedIndex} />}
          {hotKey && <KeyIcon keyName={hotKey} />}
        </div>
      </div>
      {children}
        </div>
    </div>
  );
}
