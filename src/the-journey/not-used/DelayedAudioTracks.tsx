import React from 'react';
import { Participant } from 'twilio-video';
import usePublications from '../../twilio/hooks/usePublications/usePublications';
import DelayedAudioPublication from './DelayedAudioPublication';

interface DelayedAudioTracksProps {
  participant: Participant;
}

export default function DelayedAudioTracks({ participant }: DelayedAudioTracksProps) {
  const publications = usePublications(participant).filter(p => p.kind === 'audio');

  console.log('DelayedAudioTracks', publications.length, publications);

  return (
    <>
      {publications.map(publication => (
        <DelayedAudioPublication key={publication.kind} publication={publication} />
      ))}
    </>
  );
}
