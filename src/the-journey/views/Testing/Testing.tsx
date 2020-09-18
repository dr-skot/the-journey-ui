import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { Participant, RemoteAudioTrack, Room } from 'twilio-video';
import { getRole, getTimestamp, getUsername } from '../../utils/twilio';
import { DateTime } from 'luxon';
import { Button, TextField, Typography } from '@material-ui/core';
import AudioElement from './AudioElement';
import AudioNode from './AudioNode';
import AutoJoin from '../../components/AutoJoin';
import useAudioContext from '../../contexts/AudioStreamContext/useAudioContext';
import AudioNodeOrElement from './AudioNodeOrElement';
import { DEFAULT_ROOM_NAME } from '../../../App';
import SubscribeToAllAudio from '../../subscribers/SubscribeToAllAudio';

let globalRoom: Room | undefined;

interface UnmuteButtonsProps { track: RemoteAudioTrack | null }
export function UnmuteButtons({ track }: UnmuteButtonsProps) {
  const [elementMuted, setElementMuted] = useState(true);
  const [nodeMuted, setNodeMuted] = useState(true);

  return track
    ? (
    <>
      <Button onClick={() => setElementMuted(!elementMuted)} variant="outlined">
        {`${elementMuted ? 'audio' : 'destroy'} element`}
      </Button>
      <Button onClick={() => setNodeMuted(!nodeMuted)} variant="outlined">
        {`${nodeMuted ? 'audio' : 'destroy'} node`}
      </Button>
      { !elementMuted && <AudioElement track={track} /> }
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
    <div>
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
    </div>
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
      <AutoJoin roomName={DEFAULT_ROOM_NAME}/>
      <SubscribeToAllAudio/>
      <h1>Room "{room?.name}": all participants</h1>
      { participants.map((p) => p && <TestingParticipant key={p.identity} participant={p} />) }
    </div>
  );
}


