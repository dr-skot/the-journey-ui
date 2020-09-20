import React, { useContext } from 'react';
import { TextField } from '@material-ui/core';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';

export default function GainControl() {
  const [{ gain }, changeSharedState] = useContext(SharedRoomContext);

  const setGain = (e: any) => {
    console.log('setGain', e.target.value);
    changeSharedState({ gain: e.target.value });
  }

  return (
    <TextField type="number" inputProps={{ min: 0, max: 1, step: 0.1 }} label="volume" variant="outlined" size="small"
               value={gain} onChange={setGain}
    />
  );
}
