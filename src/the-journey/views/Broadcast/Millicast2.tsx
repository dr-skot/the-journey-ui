import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, styled } from '@material-ui/core';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import useHeight from '../../hooks/useHeight/useHeight';
import fscreen from 'fscreen';
import { remove } from '../../utils/functional';
import { isFirefox } from 'react-device-detect';

const ClickBlocker = styled('div')(() => ({
  position: 'absolute',
  height: '90vh',
  width: '90vw',
  background: 'transparent',
}));

const Floater = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 10000000000000,
});

const Floated = styled('div')({
  position: 'relative',
  top: '-50%',
  left: '-50%',
});

type VideoElementListener = (el: HTMLVideoElement) => void;

let player: HTMLVideoElement;
const listeners: VideoElementListener[] = []

// @ts-ignore
window.onMillicastStreamCanPlay = (videoElement: HTMLVideoElement) => {
  console.log('millicast stream can play, unmuting');
  // videoElement.muted = false;
  player = videoElement;
  listeners.forEach((listener) => listener(videoElement));
}

export default function Millicast() {
  const height = useHeight();
  const [isFullscreen, toggleFullscreen] = useFullScreenToggle();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  const onVideoReady = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    listeners.push(onVideoReady);
    return () => remove(listeners, onVideoReady);
  }, [onVideoReady]);

  const needButton = player && (player.muted || player.paused) && (!buttonClicked);

  const finalTouches = () => {
    player.muted = false;
    player.play();
    fscreen.requestFullscreen(player);
    setButtonClicked(true);
  };

  return (
    <>
      <div style={{ position: 'absolute', height, width: '100%', background: 'black' }}>
        <iframe
          style={{ opacity: loading ? 0 : 1 }}
          ref={iframeRef}
          src="/player3/?id=keidk0k0"
          allowFullScreen
          width="100%" height="100%"
        />
      </div>
      { isFirefox && <ClickBlocker onClick={(e) => {
        console.log('click blocker!');
        e.stopPropagation()
      }} /> }
      { loading && (
        <Floater>
          <Floated>
            <CircularProgress />
          </Floated>
        </Floater>
      )}
      { needButton && (
        <Floater>
          <Floated>
          <Button onClick={finalTouches} variant="contained" color="primary">
            click<br/>to begin
          </Button>
          </Floated>
        </Floater>
      ) }
    </>
  );
}
