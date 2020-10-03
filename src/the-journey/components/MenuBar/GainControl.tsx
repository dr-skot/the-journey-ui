import React from 'react';
import { TextField } from '@material-ui/core';
import { useAppState } from '../../contexts/AppStateContext';

export default function GainControl() {
  const [{ gain }, roomStateDispatch] = useAppState();

  const setGain = (e: any) => {
    console.log('setGain', e.target.value);
    roomStateDispatch('set', { gain: e.target.value });
  }

  return (
    <TextField type="number" inputProps={{ min: 0, max: 1, step: 0.1 }} label="volume" variant="outlined" size="small"
               value={gain} onChange={setGain}
    />
  );
}
