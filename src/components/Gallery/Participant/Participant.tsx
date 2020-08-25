import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Participant as IParticipant } from 'twilio-video';
import KeyIcon from './KeyIcon/KeyIcon';
import SelectionNumber from './SelectionNumber/SelectionNumber';
import ParticipantTracks from '../../ParticipantTracks/ParticipantTracks';

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
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface ParticipantInfoProps {
  participant: IParticipant;
  children: React.ReactNode;
  onClick: () => void;
  selectedIndex: number;
  width: number;
  height: number;
  hotKey?: string;
  color: string;
}

function ParticipantInfo({
  participant, onClick, selectedIndex, children, width, height, hotKey, color,
}: ParticipantInfoProps) {
  const classes = useStyles();

  return (
    <div
      className={classes.container}
      style={{backgroundColor: color, opacity: '50%', width, height }}
      onClick={onClick}
      data-cy-participant={participant.sid}
    >
      <div className={classes.infoContainer}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            {participant.identity}
          </h4>
        </div>
        <div>
          {selectedIndex > 0 && <SelectionNumber number={selectedIndex} />}
          {hotKey && <KeyIcon keyName={hotKey} />}
        </div>
      </div>
      {children}
    </div>
  );
}


interface ParticipantProps {
  participant: IParticipant,
  onClick: () => void;
  selectedIndex: number;
  width: number,
  height: number,
  hotKey?: string;
  color: string;
}

export default function Participant({
  participant,
  onClick,
  selectedIndex,
  width,
  height,
  hotKey,
  color,
}: ParticipantProps) {
  return (
    <ParticipantInfo {...{ participant, onClick, selectedIndex, width, height, hotKey, color }}>
      <ParticipantTracks participant={participant} />
    </ParticipantInfo>
  );
}
