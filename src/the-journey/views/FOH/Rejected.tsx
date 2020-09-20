import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import SimpleMessage from '../MessageView';

export default function Rejected() {
  const [{ room  }] = useContext(AppContext);
  room?.disconnect();
  const retryUrl = window.location.toString().replace('rejected', 'entry');
  return <SimpleMessage
    title={"You’ve been disconnected!"}
    paragraphs={
      [<>If this was a mistake, you can try <a href={retryUrl}>signing in again</a></>]
    }
  />
}
