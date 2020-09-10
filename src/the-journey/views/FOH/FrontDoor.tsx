import React, { useContext } from 'react';
import { codeToTime, codeToTimeWithTZ, formatTime, punctuality, timezones } from '../../utils/foh';
import moment from 'moment';
import { DateTime } from 'luxon';
import { AppContext } from '../../contexts/AppContext';
import { BroadcastType } from '../Broadcast/Broadcast';
import SignIn from './SignIn';
import { RouteComponentProps } from 'react-router-dom';
import { defaultRoom } from '../../utils/twilio';
import Lobby from './Lobby';


interface CodeParam {
  code?: string;
}

interface BroadcastProps extends RouteComponentProps<CodeParam> {
  broadcastType: BroadcastType,
}

export default function FrontDoor({ broadcastType = 'millicast', match }: BroadcastProps) {
  const [{ roomStatus }] = useContext(AppContext);
  const code = match.params.code;
  const [time, tzIndex] = code ? codeToTimeWithTZ(code) : [undefined, -1];
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const curtain = time ? DateTime.fromJSDate(time) : DateTime.local().plus({ minutes: 15 });
  const timezone = timezones[tzIndex] || localTZ;
  const punct = punctuality(curtain);

  const lobby = `${code || defaultRoom()}`;

  if (punct === 'on time' || punct === 'late') {
    return roomStatus === 'connected'
      ? <Lobby broadcastType={broadcastType} />
      : <SignIn roomName={lobby} />
  }

  const display = {
    day: curtain.toFormat('EEEE, MMMM d'),
    time: curtain.toFormat('h:mma'),
  };

  const displayTz = {
    day: curtain.setZone(timezone).toFormat('EEEE, MMMM d'),
    time: curtain.setZone(timezone).toFormat('h:mma'),
  }

  return (
    <div>
      <h1>You're {punct}!</h1>
      <p>Show {punct.match(/late/) ? 'started' : 'starts'} at {display.time} on {display.day}</p>
      { timezone !== localTZ && (
        <p>(That's {displayTz.time} in {timezone})</p>
      ) }
    </div>
  )
}

