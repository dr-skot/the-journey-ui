import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import { AppContext } from '../../../contexts/AppContext';

const valence = (x: number) => (x < 0 ? -1 : 1);

export default function GainControl() {
  const [{ audioGain }, dispatch] = useContext(AppContext);

  return (
  <>
    gain
    <IconButton aria-label="decrease delay" onClick={() => dispatch('bumpAudioGain', { bump: -0.05 })}>
      <MinusIcon />
    </IconButton>
      {audioGain ? audioGain.toFixed(2) : 0}
    <IconButton aria-label="increase delay" onClick={() => dispatch('bumpAudioGain', { bump: 0.05 })}>
       <PlusIcon />
    </IconButton>
  </>
  );
}
