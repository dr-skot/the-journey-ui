import React, { useEffect } from 'react';
import { styled } from '@material-ui/core';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import MenuBar from '../../components/MenuBar/MenuBar';

const ClickBlocker = styled('div')(() => ({
  position: 'absolute',
  height: '90vh',
  width: '100%',
  background: 'transparent',
}));

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

export default function Millicast() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();
  useEffect(() => { if (!isFullScreen) toggleFullScreen() }, []);

  return (
    <>
      <Container>
        <MenuBar />
        <iframe
          style={{ border: 0 }}
          src="./millicast_javascript_demo/viewer.html"
          allowFullScreen
          width="100%" height="100%"
        />
      </Container>
    <ClickBlocker onClick={(e) => {
      console.log('click blocker!');
      e.stopPropagation()
    }}/>
    </>
  );
}
