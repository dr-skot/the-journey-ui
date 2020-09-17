import React, { useEffect } from 'react';
import { styled } from '@material-ui/core';
import MenuBar from '../../components/MenuBar/MenuBar';

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

export default function Millicast() {
  useEffect(() => {
    document.documentElement.requestFullscreen().catch((e) => console.log('fullscreen error', e));
  }, []);


  const iframeRef = (frame: HTMLIFrameElement) => {
    const content = frame?.contentDocument || frame?.contentWindow?.document;
    const player = content?.getElementById('player') as HTMLVideoElement;
    console.log('got player', { player, content, frame });
    if (player) player.muted = false;
  }

  return (
    <>
      <Container>
        <MenuBar />
        <iframe
          ref={iframeRef}
          src="/player3/?id=keidk0k0"
          allowFullScreen
          width="100%" height="100%"
        />
      </Container>
    </>
  );
}
