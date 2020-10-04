import React, { useState } from 'react';
import useHeight from '../hooks/useHeight/useHeight';
import CenteredInWindow from '../components/CenteredInWindow';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import { Button } from '@material-ui/core';

export default function HomePage() {
  const height = useHeight();
  const [needButton, setNeedButton] = useState(false);

  function videoRef(video: HTMLVideoElement) {
    setTimeout(() => { if (video?.paused) setNeedButton(true) }, 500);
  }

  return <>
    <div style={{ position: 'absolute', height, width: '100%', background: 'black' }}>
      <video ref={videoRef} width="100%" height="100%" src={
        'https://s3.amazonaws.com/thejourney-show/trailer.m4v'
      } autoPlay controls />
    </div>
    { needButton && (
      <div id="button">
      <CenteredInWindow>
        <Button onClick={() => {
          const video = document.getElementsByTagName('video')[0];
          if (!video) return;
          video.play();
          const button = document.getElementById('button');
          if (!button) return;
          button.style.display = 'none';
        }}>
          <PlayIcon fontSize="large"/>
        </Button>
      </CenteredInWindow>
      </div>
    ) }
  </>
}
