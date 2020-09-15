import React from 'react';
import { styled } from '@material-ui/core';
import { connectToStream, isConnecting } from './millicast-helper';
import { useAppContext } from '../../contexts/AppContext';

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

const Millicast = React.memo(() => {
  const [{ room }] = useAppContext();
  const videoRef = (element: HTMLVideoElement) => {
    console.log('ref callback with element', element, 'room', room);
    if (room && element) connectToStream(element); // don't bother until room
  };

  console.log('millicast render');
  return (
    <Container>
      <video onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
             width="100%" height="100%" ref={videoRef} autoPlay playsInline id="millicast"/>
    </Container>
  );
});
Millicast.whyDidYouRender = true;

export default Millicast;
