import React, { useEffect, useState } from 'react';
import { joinRoom } from '../../utils/twilio';
import { Participant, Room } from 'twilio-video';
import { Button, TextField } from '@material-ui/core';
import { playTracks } from '../../utils/trackPlayer';
import { DEFAULT_DELAY, setDelayTime } from '../../utils/AudioOut';


export default function Receiver() {
  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [playing, setPlaying] = useState(false);
  const [delayValue, setDelayValue] = useState(DEFAULT_DELAY);

  const togglePlaying = (p: Participant) => {
    if (!p.audioTracks?.values()?.next()?.value) return;
    console.log('toggle playing!');
    setPlaying((prev) => {
      console.log('playing?', prev);
      playTracks(prev ? [] : [p.audioTracks.values().next().value.track]);
      return !prev;
    })
  }

  useEffect(() => {
    joinRoom('audio-test', 'receiver', { automaticSubscription: true })
      .then(setRoom);
  }, []);

  useEffect(() => {
    if (!room) return;
    const update = () => setParticipants(Array.from(room.participants.values()));
    update();
    room.on('participantConnected', update);
    room.on('participantDisconnected', update);
    return () => {
      room.off('participantConnected', update);
      room.off('participantDisconnected', update);
    }
  }, [room]);

    return <>
    <h1>Reciever</h1>
      <div>
        <TextField type="number" inputProps={{ min: 0, max: 10, step: 0.1 }}
                   label="delay" variant="outlined" size="small"
                   value={delayValue} onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setDelayTime(value);
                      setDelayValue(value);
                    }}/>
      </div>
    { participants.map((p) => (
      <div key={p.identity}>
        <p>{ p.identity }</p>
        <Button onClick={() => {
          // togglePlaying(p);
          setInterval(() => togglePlaying(p), 3000);
        }}>{ playing ? 'stop' : 'play' }</Button>
      </div>
    ))}
  </>;
}
