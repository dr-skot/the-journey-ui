import { useAppState } from '../../contexts/AppStateContext';
import useShowtime from '../../hooks/useShowtime';
import { TextField } from '@material-ui/core';
import CloseDoorsButton from './CloseDoorsButton';
import React from 'react';
import { DEFAULT_DOOR_POLICY } from '../../utils/foh';

export default function DoorControls() {
  const [roomState, roomStateDispatch] = useAppState();
  const { local } = useShowtime() || {};
  const { doorsOpen } = roomState;

  console.log("FUCKING ROOM STATE IS", roomState);

  const setDoorsOpen = (e: any) => {
    roomStateDispatch('set', { doorsOpen: e.target.value });
  }

  const value = doorsOpen === undefined ? DEFAULT_DOOR_POLICY.open : doorsOpen;

  return <>
    { local ? `showtime ${local.time} ${local.day}` : null }
    | doors open
    <TextField type="number" inputProps={{ min: 0, max: 120, step: 5 }} label="minutes" variant="outlined" size="small"
               value={value} onChange={setDoorsOpen} /> before |
    <CloseDoorsButton/>
  </>
}
