import React from 'react';
import SimpleMessage from '../SimpleMessage';
import useShowtime from '../../hooks/useShowtime';
import Entry from './Entry';

export default function FrontDoor({ test }: { test?: boolean }) {
  const { canEnter, punct, doorPolicy, local, venue } = useShowtime();

  if (canEnter) return <Entry test={test}/>;

  return (
    <SimpleMessage
      title={`You’re ${punct}!`}
      paragraphs={[
        <>This show {punct.match(/late/) ? 'started' : 'starts'} at {local.time} on {local.day}.</>,
        <>{local.time !== venue.time && <>({venue.time} in {venue.timezone}.)</>}</>,
        <>{punct === 'early' && `Doors open ${doorPolicy.open} min before showtime.`}</>,
        <>{punct === 'too late' && `Doors closed at ${venue.doorsClose}.`}</>,
      ]}
    />
  );
}
