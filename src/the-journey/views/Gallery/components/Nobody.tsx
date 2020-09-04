import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { muppetImageForIdx } from '../../../mockup/Muppet';

const useStyles = makeStyles(() => createStyles({
  nobody: {
    width: '100%',
    height: '100%',
    border: '0.5px solid black',
  }
}));

const PALETTE = ['#EFE2F4', '#D2D3F3', '#E1DAF4', '#C4CBF2'];
const paletteColor = (i: number) => PALETTE[i % PALETTE.length];

interface NobodyProps {
  width: number;
  height: number;
  index: number;
}

export default function Nobody({ width, height, index }: NobodyProps) {
  const classes = useStyles();
  const image = `url(${muppetImageForIdx(index + 1)})`; // muppets start at 1 not 0
  return (
    <div className={classes.nobody} style={{ width, height, backgroundColor: paletteColor(index) }}>
      <div style={{ width, height, backgroundImage: image, opacity: '25%', backgroundSize: 'cover',
      }}>

      </div>
    </div>
  )
}
