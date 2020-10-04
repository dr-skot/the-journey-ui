import React, { useEffect, useState } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { Participant, RemoteAudioTrack, Room } from 'twilio-video';
import { getRole, getTimestamp, getUsername } from '../../utils/twilio';
import { DateTime } from 'luxon';
import { Button } from '@material-ui/core';
import AudioElement from './AudioElement';
import AudioNode from './AudioNode';
import AutoJoin from '../../components/AutoJoin';
import Subscribe from '../../subscribers/Subscribe';
import CloningAudioNode from './CloningAudioNode';

let globalRoom: Room | undefined;

interface UnmuteButtonsProps { track: RemoteAudioTrack | null }
export function UnmuteButtons({ track }: UnmuteButtonsProps) {
  const [elementMuted, setElementMuted] = useState(true);
  const [nodeMuted, setNodeMuted] = useState(true);
  const [cloningNodeMuted, setCloningNodeMuted] = useState(true);

  return track
    ? (
    <>
      <Button onClick={() => setElementMuted(!elementMuted)} variant="outlined">
        {`${elementMuted ? 'audio' : 'destroy'} element`}
      </Button>
      <Button onClick={() => setNodeMuted(!nodeMuted)} variant="outlined">
        {`${nodeMuted ? 'audio' : 'destroy'} node`}
      </Button>
      <Button onClick={() => setCloningNodeMuted(!cloningNodeMuted)} variant="outlined">
        {`${cloningNodeMuted ? 'audio' : 'destroy'} cloning node`}
      </Button>
      { !elementMuted && <AudioElement track={track} /> }
      { !nodeMuted && <AudioNode track={track} /> }
      { !cloningNodeMuted && <CloningAudioNode track={track} /> }
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
  }, [participant, rerender]);

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
  const [{ room }] = useTwilioRoomContext();
  const participants = useParticipants('includeMe');

  globalRoom = room;
  // if (roomStatus !== 'connected') return <SignIn roomName="testing" />

  console.log('participants', participants);

  return (
    <div style={{margin: '2em'}}>
      <AutoJoin />
      <Subscribe profile="audio"/>
      <h1>Room "{room?.name}": all participants</h1>
      { participants.map((p) => p && <TestingParticipant key={p.identity} participant={p} />) }
    </div>
  );
}


