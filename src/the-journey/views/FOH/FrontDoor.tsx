import React from 'react';
import { codeToTimeWithTZ, punctuality, timezones } from '../../utils/foh';
import { DateTime } from 'luxon';
import { RouteComponentProps } from 'react-router-dom';
import Entry from '../Entry/Entry';
import { defaultRoom } from '../../utils/twilio';
import SimpleMessage from '../MessageView';


interface CodeParam {
  code?: string;
}

export default function FrontDoor({ match }: RouteComponentProps<CodeParam>) {
  const code = match.params.code;
  const [time, tzIndex] = code ? codeToTimeWithTZ(code) : [undefined, -1];
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const curtain = time ? DateTime.fromJSDate(time) : DateTime.local().plus({ minutes: 15 });
  const timezone = timezones[tzIndex] || localTz;
  const punct = punctuality(curtain);

  const roomName = `${code || defaultRoom()}`;

  if (punct === 'on time' || punct === 'late') {
    return <Entry roomName={roomName} />
  }

  const display = {
    day: curtain.toFormat('EEEE, MMMM d'),
    time: curtain.toFormat('h:mma'),
  };

  const displayTz = {
    day: curtain.setZone(timezone).toFormat('EEEE, MMMM d'),
    time: curtain.setZone(timezone).toFormat('h:mma'),
  }

  const friendlyTimezone = (timezone: string) => (
    timezone.replace(/^.*\//, '').replace('_', ' ')
  )

  const timezoneIsLocal = timezone === localTz;

  return (
    <SimpleMessage
      title={`You’re ${punct}!`}
      paragraphs={[
        <>This show {punct.match(/late/) ? 'started' : 'starts'} at {display.time} on {display.day}.</>,
        <>{ timezoneIsLocal && <p>({displayTz.time} in {friendlyTimezone(timezone)}.)</p> }</>,
        ]}
    />
  )

}

