import React from 'react';
import { Button } from '@material-ui/core';
import { useAppState } from '../../contexts/AppStateContext';
import MenuButton from './MenuButton';

export default function UpdateDataButton() {
  const [, roomStateDispatch] = useAppState();
  return MenuButton('reload data', () => roomStateDispatch('getRoomState'));
}
