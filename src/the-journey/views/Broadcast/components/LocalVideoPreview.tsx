import React from 'react';
import { useLocalVideoTrack } from '../../../hooks/useLocalVideoTrack';
import VideoTrack from '../../../../twilio/components/VideoTrack/VideoTrack';

export default function LocalVideoPreview() {
  const videoTrack = useLocalVideoTrack();
  console.log('video track',  videoTrack);
  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null;
}
