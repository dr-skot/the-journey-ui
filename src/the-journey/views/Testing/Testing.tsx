import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { Participant, RemoteAudioTrack, Room } from 'twilio-video';
import { getRole, getTimestamp, getUsername } from '../../utils/twilio';
import { DateTime } from 'luxon';
import { Button, Typography } from '@material-ui/core';
import AudioTrack from './AudioTrack';
import AudioNode from './AudioNode';
import AutoJoin from '../../components/AutoJoin';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';

let globalRoom: Room | undefined;

interface UnmuteButtonsProps { track: RemoteAudioTrack | null }
function UnmuteButtons({ track }: UnmuteButtonsProps) {
  const [elementMuted, setElementMuted] = useState(true);
  const [nodeMuted, setNodeMuted] = useState(true);
  const [nodeConnected, setNodeConnected] = useState(false);
  const [gain] = useState(0  );
  const audioContext = useAudioContext();
  const gainNode = useRef<GainNode>();
  const audioNode = useRef<AudioNode>();

  useEffect(() => {
    if (!audioContext || !track) return;
    const stream = new MediaStream([track.mediaStreamTrack])
    audioNode.current = audioContext.createMediaStreamSource(stream);
    return () => audioNode.current?.disconnect();
  }, [audioContext, track]);

  useEffect(() => {
    if (nodeConnected && audioContext) audioNode.current?.connect(audioContext.destination);
    else audioNode.current?.disconnect();
    return () => { audioNode.current?.disconnect() };
  }, [nodeConnected, audioContext])

  /*
  useEffect(() => {
    console.log('persistent node audiocontext?')
    if (!audioContext || !track) return;
    const newAC = new AudioContext() || audioContext;
    console.log('yes, setting up node for', track.mediaStreamTrack);
    const stream = new MediaStream([track.mediaStreamTrack])
    const node = newAC.createMediaStreamSource(stream);
    gainNode.current = newAC.createGain();
    gainNode.current.gain.setValueAtTime(0, newAC.currentTime);
    let intervalId = setInterval(() => {
      if (gainNode.current?.gain.value === 0) {
        console.log('gain is 0!');
        clearInterval(intervalId);
        node.connect(gainNode.current).connect(newAC.destination);
      } else {
        console.log('still not 0', gainNode.current?.gain.value);
        gainNode.current?.gain.setValueAtTime(0.1, newAC.currentTime + 0.5);
      }
    }, 500);
    return () => node.disconnect();
  }, [audioContext, track]);
   */

  useEffect(() => {
    gainNode.current?.gain.setValueAtTime(gain, audioContext!.currentTime);
  }, [gain])

  return track
    ? (
    <>
      <Button onClick={() => setElementMuted(!elementMuted)} variant="outlined">
        {`${elementMuted ? 'create' : 'destroy'} element`}
      </Button>
      <Button onClick={() => setNodeMuted(!nodeMuted)} variant="outlined">
        {`${nodeMuted ? 'create' : 'destroy'} node`}
      </Button>
      <Button onClick={() => setNodeConnected(!nodeConnected)} variant="outlined">
        {`${nodeConnected ? 'disconnect' : 'connect'} node`}
      </Button>
      {/*
      <Button onClick={() => setGain(gain ? 0 : 1)} variant="outlined">
        {`set gain to ${gain ? '0' : '1'}`}
      </Button>
      */}
      { !elementMuted && <AudioTrack track={track} /> }
      { !nodeMuted && <AudioNode track={track} /> }
    </>
    ) : <span>null track</span>;
}

interface TestingParticipantProps { participant: Participant }
function TestingParticipant({ participant }: TestingParticipantProps) {
  const room = globalRoom;
  const p = participant;
  const name = getUsername(p.identity);
  const role = getRole(p);
  const timestamp = DateTime.fromSeconds(parseInt(getTimestamp(p)));
  const isMe = room?.localParticipant === p;
  const [, rerender] = useState();

  useEffect(() => {
    participant.on('trackSubscribed', rerender);
    return () => { participant.off('trackSubscribed', rerender) }
  }, []);

  return (
    <>
    <h2>{name}, role: {role}, arrived: {timestamp.toFormat('h:mm:ss a')}</h2>
    <Typography>
      { p.state } { ' | ' }
      { isMe
        ? 'me'
        : (
          <>
            <span>{p.audioTracks.size} tracks: </span>
            { Array.from(p.audioTracks.values()).map((pub, i) => (
              <UnmuteButtons key={`${p.identity} track ${i}`} track={pub.track as RemoteAudioTrack} />
            )) }
          </>
        )
      }
    </Typography>
      </>
  );
}

export default function Testing() {
  const [{ room }] = useAppContext();
  const participants = useParticipants('includeMe');

  globalRoom = room;
  // if (roomStatus !== 'connected') return <SignIn roomName="testing" />

  console.log('participants', participants);

  return (
    <div style={{margin: '2em'}}>
      <AutoJoin/>
      <h1>Room "{room?.name}": all participants</h1>
      { participants.map((p) => p && <TestingParticipant key={p.identity} participant={p} />) }
    </div>
  );
}
