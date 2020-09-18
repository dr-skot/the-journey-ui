import React from 'react';
import { codeToTimeWithTZ, punctuality, timezones } from '../../utils/foh';
import { DateTime } from 'luxon';
import { RouteComponentProps } from 'react-router-dom';
import MinEntry from '../Min/MinEntry';
import { defaultRoom } from '../../utils/twilio';


interface CodeParam {
  code?: string;
}

export default function FrontDoor({ match }: RouteComponentProps<CodeParam>) {
  const code = match.params.code;
  const [time, tzIndex] = code ? codeToTimeWithTZ(code) : [undefined, -1];
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const curtain = time ? DateTime.fromJSDate(time) : DateTime.local().plus({ minutes: 15 });
  const timezone = timezones[tzIndex] || localTZ;
  const punct = punctuality(curtain);

  const roomName = `${code || defaultRoom()}`;

  if (punct === 'on time' || punct === 'late') {
    return <MinEntry roomName={roomName} />
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

