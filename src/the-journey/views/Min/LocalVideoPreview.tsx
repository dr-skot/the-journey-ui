import React from 'react';
import { useLocalVideoTrack } from '../../hooks/useLocalVideoTrack';
import VideoTrack from '../../components/VideoTrack/VideoTrack';

export default function LocalVideoPreview() {
  const videoTrack = useLocalVideoTrack();
  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null;
}
