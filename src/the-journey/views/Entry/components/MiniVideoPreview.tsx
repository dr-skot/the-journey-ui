import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalVideoTrack } from 'twilio-video';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import VideoTrack from '../../../components/VideoTrack/VideoTrack';

const useStyles = makeStyles({
  preview: {
    height: '144px',
    width: '256px',
    margin: '0.5em 0',
  },
});

export default function MiniVideoPreview() {
  const classes = useStyles();
  const [{ localTracks }] = useContext(TwilioRoomContext);

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack;

  return (
    <div className={classes.preview}>
      { localVideoTrack && <VideoTrack isLocal track={localVideoTrack}/> }
    </div>
  );
}
