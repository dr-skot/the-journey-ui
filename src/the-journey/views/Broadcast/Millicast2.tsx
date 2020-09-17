import React, { useEffect, useRef, useState } from 'react';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);


  function handleClickHopefully(e: { preventDefault: () => void; stopPropagation: () => void; }) {
    e.preventDefault();
    e.stopPropagation();
    console.log('tried to stop the click');
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
