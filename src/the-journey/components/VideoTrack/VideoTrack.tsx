import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../../types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';
// import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
  reverse?: boolean;
}

export default function VideoTrack({ track, isLocal, priority, reverse = true }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  // const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // mirror unless asked not to
  const style = reverse ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}
