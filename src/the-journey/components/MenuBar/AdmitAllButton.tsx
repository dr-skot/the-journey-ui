import React, { useContext } from 'react';
import { SharedRoomStateContext } from '../../contexts/SharedRoomStateContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { getIdentities, isRole } from '../../utils/twilio';
import { Button } from '@material-ui/core';

export default function AdmitAllButton() {
  const  [, changeSharedState] =  useContext(SharedRoomStateContext)
  const audience = useParticipants().filter(isRole('audience'));

  function admitAll() {
    console.log('changing admitted to', getIdentities(audience));
    changeSharedState({ admitted: getIdentities(audience) });
  }

  return (
    <Button
      style={{ margin: '0.5em' }}
      onClick={admitAll}
      size="small" color="primary" variant="contained">
      Admit All
    </Button>
  )
}
