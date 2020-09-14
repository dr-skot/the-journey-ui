import React, { useContext } from 'react';
import { SharedRoomStateContext } from '../../contexts/SharedRoomStateContext';
import { Button } from '@material-ui/core';

export default function UnadmitAllButton() {
  const  [, changeSharedState] =  useContext(SharedRoomStateContext);

  function unadmitAll() {
    console.log('changing admitted to', []);
    // @ts-ignore
    changeSharedState({ admitted: [] });
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={unadmitAll}
      size="small" color="primary" variant="contained">
      Pull All Back to Lobby
    </Button>
  )
}
