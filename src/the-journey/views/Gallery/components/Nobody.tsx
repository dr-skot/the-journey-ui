import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { muppetImageForIdx } from '../../../components/Participant/Muppet';

const useStyles = makeStyles(() => createStyles({
  nobody: {
    width: '100%',
    height: '100%',
  }
}));

export type Blanks = 'outline' | 'muppet' | 'nothing' | undefined;

const PALETTE = ['#EFE2F4', '#D2D3F3', '#E1DAF4', '#C4CBF2'];
const paletteColor = (i: number) => PALETTE[i % PALETTE.length];

interface NobodyProps {
  width: number;
  height: number;
  index: number;
  blanks?: Blanks;
}

export default function Nobody({ width, height, index, blanks }: NobodyProps) {
  const classes = useStyles();
  const image = `url(${muppetImageForIdx(index + 1)})`; // muppets start at 1 not 0
  return (
    <div className={classes.nobody} style={{
      width, height,
      backgroundColor: blanks === 'muppet' ? paletteColor(index) : '',
      border: blanks === 'nothing' ? '' : '0.5px solid black',
    }}>
      { blanks === 'muppet' &&
        <div style={{ width, height, backgroundImage: image, opacity: '25%', backgroundSize: 'cover' }} /> }
    </div>
  )
}
