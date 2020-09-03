import React, { useContext } from 'react';
import { codeToTime, formatTime, punctuality } from '../../utils/foh';
import moment from 'moment';
import { AppContext } from '../../contexts/AppContext';
import Broadcast, { BroadcastType } from '../Broadcast/Broadcast';
import Holding from './Holding';
import SignIn from './SignIn';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { defaultRoom } from '../../utils/twilio';

interface LobbyProps {
  broadcastType: BroadcastType,
}

function Lobby({ broadcastType }: LobbyProps) {
  const [{ room, admitted, rejected }] = useContext(AppContext);
  const { identity } = room?.localParticipant || {};
  return (!identity || rejected.includes(identity)) ? <Redirect to="/rejected" />
    : admitted.includes(identity) ? <Broadcast type={broadcastType} />
    : <Holding />;
}

interface CodeParam {
  code?: string;
}

interface BroadcastProps extends RouteComponentProps<CodeParam> {
  broadcastType: BroadcastType,
}

export default function FrontDoor({ broadcastType = 'millicast', match }: BroadcastProps) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;

  const curtain = code ? moment(codeToTime(code)) : moment().add(15, 'minutes');
  const punct = punctuality(curtain, moment());

  if (punct === 'on time' || punct === 'late') {
    return roomStatus === 'connected'
      ? <Lobby broadcastType={broadcastType} />
      : <SignIn roomName={code || defaultRoom()} />
  }

  const display = formatTime(curtain);

  return (
    <div>
      <h1>You're {punct}!</h1>
      <p>Show {punct.match(/late/) ? 'started' : 'starts'} at {display.time} on {display.day}</p>
    </div>
  )
}

