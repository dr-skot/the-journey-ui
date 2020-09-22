import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalVideoTrack } from 'twilio-video';
import { AppContext } from '../../../contexts/AppContext';
import VideoTrack from '../../../components/VideoTrack/VideoTrack';

const useStyles = makeStyles({
  preview: {
    width: '250px',
    margin: '0.5em 0',
  },
});

export default function MiniVideoPreview() {
  const classes = useStyles();
  const [{ localTracks }] = useContext(AppContext);

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack;

  return localVideoTrack && (
    <div className={classes.preview}>
      <VideoTrack isLocal track={localVideoTrack}/>
    </div>
  );
}
