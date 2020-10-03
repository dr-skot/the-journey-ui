import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, styled } from '@material-ui/core';
import useHeight from '../../hooks/useHeight/useHeight';
import fscreen from 'fscreen';
import { remove } from '../../utils/functional';
import { isFirefox } from '../../utils/browser';
import CenteredInWindow from '../../components/CenteredInWindow';

const ClickBlocker = styled('div')(() => ({
  position: 'absolute',
  height: '90vh',
  width: '90vw',
  background: 'transparent',
}));

type VideoElementListener = (el: HTMLVideoElement) => void;
type ResponseListener = (res: any) => void;

let player: HTMLVideoElement;
const successListeners: VideoElementListener[] = [];
const failureListeners: ResponseListener[] = [];

// @ts-ignore
window.onMillicastStreamCanPlay = (videoElement: HTMLVideoElement) => {
  console.log('millicast stream can play, unmuting');
  // videoElement.muted = false;
  player = videoElement;
  successListeners.forEach((listener) => listener(videoElement));
}

// @ts-ignore
window.onMillicastError = (response: any) => {
  console.log('millicast error', response);
  failureListeners.forEach((listener) => listener(response));
}

export default function Millicast() {
  const height = useHeight();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [buttonClicked, setButtonClicked] = useState(false);

  console.log('RENDER: Millicast');

  const onVideoReady = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const onError = useCallback((error) => {
    setLoading(false);
    setError(error);
  }, [setLoading, setError]);

  useEffect(() => {
    successListeners.push(onVideoReady);
    failureListeners.push(onError);
    return () => {
      remove(successListeners, onVideoReady);
      remove(failureListeners, onError);
    }
  }, [onVideoReady, onError]);

  const needButton = player && (player.muted || player.paused) && (!buttonClicked);

  const finalTouches = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (player) {
      player.muted = false;
      player.play().finally();
    }
    if (iframeRef.current) fscreen.requestFullscreen(iframeRef.current);
    setButtonClicked(true);
  };

  return (
    <>
      <div style={{ position: 'absolute', height, width: '100%', background: 'black' }}>
        <iframe
          title={'The Journey'}
          style={{ opacity: loading || error ? 0 : 1 }}
          ref={iframeRef}
          src={'/millicast-stereo/viewer.html'}
          allowFullScreen
          width="100%" height="100%"
        />
      </div>
      { error && (
        <CenteredInWindow>
          <h1>Stream not available!</h1>
        </CenteredInWindow>
      ) }
      { isFirefox && <ClickBlocker onClick={(e) => {
        console.log('click blocker!');
        e.stopPropagation()
      }} /> }
      { loading && !error && (
        <CenteredInWindow>
            <CircularProgress />
        </CenteredInWindow>
      )}
      { !loading && !error && needButton && (
        <CenteredInWindow>
          <Button onClick={finalTouches} variant="contained" color="primary">
            click here<br/>to begin
          </Button>
        </CenteredInWindow>
      ) }
    </>
  );
}
