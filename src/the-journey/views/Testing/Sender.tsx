import React, { useEffect, useState } from 'react';
import { Room } from 'twilio-video';
import { getLocalTracks, joinRoom, publishTracks } from '../../utils/twilio';

export default function Sender() {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    joinRoom('audio-test', 'sender')
      .then((room) => {
        getLocalTracks().then((tracks) => {
          publishTracks(room, tracks);
          setRoom(room);
        });
      });
  }, [setRoom]);

  return <>
    <h1>Sender</h1>
    <p>{ room?.state === 'connected' ? 'room joined' : 'joining room...'}</p>
  </>;
}
