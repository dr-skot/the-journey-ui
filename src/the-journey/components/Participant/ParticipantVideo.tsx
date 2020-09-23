import React, { useContext } from 'react';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';
import usePublications from '../../../twilio/hooks/usePublications/usePublications';
import VideoTrack from '../VideoTrack/VideoTrack';
import { IVideoTrack } from '../../../types';
import { Participant, Track } from 'twilio-video';

interface ParticipantVideoProps {
  participant: Participant;
  videoPriority?: Track.Priority | null;
}

export default function ParticipantVideo({ participant, videoPriority, }: ParticipantVideoProps) {
  const [{ room }] = useContext(TwilioRoomContext);
  const isLocal = participant === room?.localParticipant;
  let publications = usePublications(participant);

  const publication = publications.find(p => p.trackName.includes('camera'));
  const track = publication?.track;

  if (!track) return null;

  // TODO  maybe isLocal can rely on  track is LocalVideoTrack? and we don't need room at all?

  return (
    <VideoTrack
      track={track as IVideoTrack}
      priority={videoPriority}
      isLocal={isLocal}
    />
    );
}
