import React, { useEffect, useState } from 'react';
import { joinRoom } from '../../utils/twilio';
import { Participant, RemoteAudioTrack, Room } from 'twilio-video';
import { Button, TextField } from '@material-ui/core';
import { getAudioContext } from '../../utils/audio';
import { playTracks, setDelayTime } from '../../utils/trackPlayer';
import { DEFAULT_DELAY } from '../../contexts/AudioStreamContext/AudioStreamContext';

export default function Receiver() {
  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [playing, setPlaying] = useState(false);
  const [delayValue, setDelayValue] = useState(DEFAULT_DELAY);

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
  }, [room])

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
          playTracks(playing ? [] : [p.audioTracks.values().next().value.track]);
          setPlaying((prev) => !prev);
        }}>{ playing ? 'stop' : 'play' }</Button>
      </div>
    ))}
  </>;
}


function playWithAudioContext(track: RemoteAudioTrack) {
  getAudioContext().then((audioContext) => {
    // create a media stream source using the track
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = audioContext.createMediaStreamSource(stream);
    console.debug('node created', node);

    // create a media stream destination in the audio context
    const destination = audioContext.createMediaStreamDestination();
    const delayNode = audioContext.createDelay(10);
    delayNode.delayTime.value = 2;

    delayNode.connect(destination);
    node.connect(delayNode);

    console.debug('connected to delayNode', delayNode);
    console.debug('connected to destination', destination);

    // set the destination's MediaStream as the audio element's srcObject
    const audio = document.createElement('audio');
    audio.srcObject = destination.stream;
    audio.autoplay = true;
    console.debug('attached to audio', audio);

    // add audio element to document
    document.body.appendChild(audio);
    console.log('added to document');
  });
}
