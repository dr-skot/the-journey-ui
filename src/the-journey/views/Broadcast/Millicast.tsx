import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, styled } from '@material-ui/core';
import useHeight from '../../hooks/useHeight/useHeight';
import fscreen from 'fscreen';
import { remove } from '../../utils/functional';

const isFirefox  = navigator.userAgent.indexOf('Firefox') > -1;

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

  const finalTouches = () => {
    player.muted = false;
    player.play().finally();
    fscreen.requestFullscreen(player);
    setButtonClicked(true);
  };

  return (
    <>
      <div style={{ position: 'absolute', height, width: '100%', background: 'black' }}>
        <iframe
          title={'The Journey'}
          style={{ opacity: loading || error ? 0 : 1 }}
          ref={iframeRef}
          src={'/player3/?id=keidk0k0'}
          allowFullScreen
          width="100%" height="100%"
        />
      </div>
      { isFirefox && <ClickBlocker onClick={(e) => {
        console.log('click blocker!');
        e.stopPropagation()
      }} /> }
      { loading && !error && (
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
      { error && (
        <Floater>
          <Floated>
            <h1>Stream not available!</h1>
          </Floated>
        </Floater>
      ) }
    </>
  );
}
