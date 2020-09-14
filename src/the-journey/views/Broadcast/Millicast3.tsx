import React from 'react';
import { styled } from '@material-ui/core';
import { connectToStream, isConnecting } from './millicast-helper';

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

const Millicast = () => {
  const videoRef = (element: HTMLVideoElement) => {
    console.log('ref callback with element', element);
    if (element) connectToStream(element);
  };

  return (
    <Container>
      <video onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
             width="100%" height="100%" ref={videoRef} autoPlay playsinline id="millicast"/>
    </Container>
  );
};
Millicast.whyDidYouRender = true;

export default Millicast;
