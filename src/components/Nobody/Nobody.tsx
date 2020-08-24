import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PinIcon from '../ParticipantInfo/PinIcon/PinIcon';
import { Participant } from '../MockGallery/Gallery';


const sid2coords = (sid: number) => {
  const row = Math.floor(sid / 5) + 1;
  const col = "ABCDE"[sid % 5];
  return `${col}${row}`;
}
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234';

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
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  width: number;
  height: number;
  img: string;
}

function ParticipantInfo({ participant, onClick, isSelected, children, width, height, img }: ParticipantInfoProps) {
  const classes = useStyles();

  const src = `url(${process.env.PUBLIC_URL}/mock-participants/${img}.png)`;
  console.log('src', src);

  return (
    <div
      className={classes.container}
      style={{backgroundColor: participant.color, opacity: '50%', width, height, backgroundImage: src }}
      onClick={onClick}
      data-cy-participant={participant.sid}
    >
      <div className={classes.infoContainer}>
        <div className={classes.infoRow}>
        </div>
        <div>
          {isSelected && <PinIcon />}
        </div>
      </div>
      {children}
    </div>
  );
}


interface NobodyProps {
  participant: Participant,
  onClick: () => void;
  isSelected: boolean;
  width: number,
  height: number,
  img: string,
}

export default function Nobody({
  participant,
  onClick,
  isSelected,
  width,
  height,
  img,
}: NobodyProps) {
  return (
    <ParticipantInfo participant={participant} onClick={onClick} isSelected={isSelected} width={width} height={height} img={img}>
      {KEYS[participant.sid]}
    </ParticipantInfo>
  );
}
