import React, { useContext } from 'react';
import { Participant, Track } from 'twilio-video';
import Publication from './Publication';
import { AppContext } from '../contexts/AppContext';
import { getPublications } from '../utils/twilio';
import { listKey } from '../utils/react-help';

interface ParticipantTracksProps {
  participant: Participant;
  disableAudio?: boolean;
  disableVideo?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  participant,
  disableAudio,
  disableVideo,
  enableScreenShare,
  videoPriority,
}: ParticipantTracksProps) {
  const [{ room }] = useContext(AppContext);
  const isLocal = participant === room?.localParticipant;
  let publications = getPublications(participant);

  if (enableScreenShare && publications.some(p => p.trackName.includes('screen'))) {
    publications = publications.filter(p => !p.trackName.includes('camera'));
  } else {
    publications = publications.filter(p => !p.trackName.includes('screen'));
  }

  if (disableVideo) publications = publications.filter(p => p.kind !== 'video');

  return (
    <>
      {publications.map((publication, i) => (
        <Publication
          key={listKey(publication.kind, i)}
          publication={publication}
          participant={participant}
          isLocal={isLocal}
          disableAudio={disableAudio}
          videoPriority={videoPriority}
        />
      ))}
    </>
  );
}
