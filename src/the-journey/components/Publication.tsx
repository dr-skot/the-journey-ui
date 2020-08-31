import React from 'react';
import AudioTrack from '../../twilio/components/AudioTrack/AudioTrack';
import VideoTrack from '../../twilio/components/VideoTrack/VideoTrack';

import { IVideoTrack } from '../../types';
import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocal: boolean;
  disableAudio?: boolean;
  videoPriority?: Track.Priority | null;
}

export default function Publication({ publication, isLocal, disableAudio, videoPriority }: PublicationProps) {
  const track = publication.track;

  console.log('track', track);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={track.name.includes('camera') && isLocal}
        />
      );
    case 'audio':
      return disableAudio ? null : <AudioTrack track={track as IAudioTrack} />;
    default:
      return null;
  }
}
