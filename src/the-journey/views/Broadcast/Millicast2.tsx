import React, { useEffect, useState } from 'react';
import { Button, styled } from '@material-ui/core';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import useHeight from '../../hooks/useHeight/useHeight';
import fscreen from 'fscreen';

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

export default function Millicast() {
  const height = useHeight();
  const [isFullscreen, toggleFullscreen] = useFullScreenToggle();
  const [v, setV] = useState<HTMLVideoElement>();

  const iframeRef = (frame: HTMLIFrameElement) => {
    const content = frame?.contentDocument || frame?.contentWindow?.document;
    const player = content?.getElementById('player') as HTMLVideoElement;
    console.log('got player', { player, content, frame });
    if (player) {
      player.muted = false;
      // if (!isFullscreen) toggleFullscreen();
      setV(player);
    }
  }

  const unmuteAndFullscreen = () => {
    console.log({ v });
    if (v) {
      console.log('unmuting and fullscreening', { v, isFullscreen });
      v.muted = false;
      // if (!isFullscreen) toggleFullscreen();
    }
  }

  return (
    <>
      <div style={{ position: 'absolute', height, width: '100%' }}>
        <iframe
          ref={iframeRef}
          src="/player3/?id=keidk0k0"
          allowFullScreen
          width="100%" height="100%"
        />
      </div>
    </>
  );
}
