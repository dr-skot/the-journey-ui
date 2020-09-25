import React from 'react';
import SimpleMessage from '../SimpleMessage';
import useShowtime from '../../hooks/useShowtime';
import Entry from './Entry';

export default function FrontDoor() {
  const showtime = useShowtime();

  if (!showtime) return (
    <SimpleMessage
      title="Hmm..."
      paragraphs={[
        <>That doesn’t look like a valid show code. Please check the code and try again.</>
      ]}
      />
    );

  const { canEnter, punct, doorPolicy, local, venue } = showtime;

  if (canEnter) return <Entry/>;

  return (
    <SimpleMessage
      title={`You’re ${punct}!`}
      paragraphs={[
        <>This show {punct.match(/late/) ? 'started' : 'starts'} at {local.time} on {local.day}.</>,
        <>{local.time !== venue.time && <>({venue.time} in {venue.timezone}.)</>}</>,
        <>{punct === 'early' && `Doors open ${doorPolicy.open} min before showtime.`}</>,
        <>{punct === 'too late' && venue.doorsClose && `Doors closed at ${venue.doorsClose}.`}</>,
      ]}
    />
  );
}
