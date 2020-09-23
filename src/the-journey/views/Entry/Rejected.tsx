import React, { useContext } from 'react';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';
import SimpleMessage from '../SimpleMessage';

export default function Rejected() {
  const [{ room  }] = useContext(TwilioRoomContext);
  room?.disconnect();
  const retryUrl = window.location.toString().replace('rejected', 'entry');
  return <SimpleMessage
    title={"You’ve been disconnected!"}
    paragraphs={
      [<>If this was a mistake, you can try <a href={retryUrl}>signing in again</a></>]
    }
  />
}
