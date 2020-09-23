import React, { useState } from 'react';
import CenteredInWindow from '../../components/CenteredInWindow';
import { Button } from '@material-ui/core';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { clearRoom } from '../../utils/twilio';
import AutoJoin from '../../components/AutoJoin';
import Notification from '../../components/Notification';

export default function ClearRoom() {
  const [{ room }] = useTwilioRoomContext();
  const [justCleared, setJustCleared] = useState(false);

  function clear() {
    clearRoom(room).then(() => {
        setJustCleared(true);
        setTimeout(() => setJustCleared(false), 3000);
      });
  }

  return <>
    <AutoJoin role="operator" />
    <CenteredInWindow>
      <div style={{ textAlign: 'center' }}>
        <h3>Room "{room?.name}"</h3>
        <Button onClick={() => clear()} variant="contained" color="primary">
          clear room
        </Button>
      </div>
    </CenteredInWindow>
    <Notification message="Cleared." open={justCleared}/>
  </>
}

