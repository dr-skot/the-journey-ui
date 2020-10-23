import React from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import { TextField } from '@material-ui/core';
import { MAX_DELAY_TIME } from '../../utils/trackPlayer';

export default function DelayControl() {
  const [{ delayTime }, roomStateDispatch] = useAppState();

  const setDelayTime = (e: any) => {
    roomStateDispatch('set', { delayTime: e.target.value });
  }

  return (
    <TextField type="number" inputProps={{ min: 0, max: 9.9, step: 0.1 }}
               label="delay" variant="outlined" size="small"
               value={delayTime} onChange={setDelayTime}
    />
  );
}
