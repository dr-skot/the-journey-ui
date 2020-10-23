import React, { useCallback, useEffect, useState } from 'react';
import { joinRoom } from '../../utils/twilio';
import { Participant, RemoteAudioTrack, RemoteAudioTrackPublication, Room } from 'twilio-video';
import { Button } from '@material-ui/core';
import { getAudioContext } from '../../utils/audio';
import { remove } from '../../utils/functional';

export default function Receiver() {
  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<Participant[]>([]);

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

  const playTrack = useCallback((pub?: RemoteAudioTrackPublication) => {
    if (!pub) return;
    console.log('playing track', pub.track);
  }, []);

  return <>
    <h1>Reciever</h1>
    { Array.from(room?.participants.values() || []).map((p) => (
      <div key={p.identity}>
        <p>{ p.identity }</p>
        <Button onClick={() => {
          playWithAudioContext(p.audioTracks.values().next().value.track);
        }}>play</Button>
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
