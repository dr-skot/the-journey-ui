import { useAppState } from '../../../contexts/AppStateContext';
import { DEFAULT_DOOR_POLICY } from '../../../utils/foh';
import { TextField } from '@material-ui/core';
import React from 'react';

export default function DoorsOpenControl() {
  const [{ doorsOpen }, roomStateDispatch] = useAppState();
  // legacy defense: doorsOpen should never be undefined
  const value = doorsOpen === undefined ? DEFAULT_DOOR_POLICY.open : doorsOpen;

  const setDoorsOpen = (e: any) => {
    roomStateDispatch('set', { doorsOpen: parseFloat(e.target.value) });
  }
  return <div style={{ display: 'flex', alignItems: 'center' }}>
    <p style={{ margin: '0.25em' }}>doors open</p>
    <TextField type="number" variant="outlined" size="small"
               inputProps={{ min: 0, max: 120, step: 5 }} label="minutes"
               value={value} onChange={setDoorsOpen}/>
    <p style={{ margin: '0.25em' }}>before</p>
  </div>;
}
