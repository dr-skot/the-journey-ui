import React from 'react';
import { styled } from '@material-ui/core';

const ClickBlocker = styled('div')(() => ({
  position: 'absolute',
  top: '20vh',
  height: '60vh',
  width: '100%',
  background: 'transparent',
}));

const Container = styled('div')(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%'
}))

export default function Millicast() {
  return (
    <>
      <Container>
        <iframe src="https://viewer.millicast.com/v2?streamId=Wu3EU2/keidk0k0&muted=true&autoPlay=true"
                allowFullScreen width="100%" height="100%"
        />
      </Container>
    <ClickBlocker onClick={(e) => {
      console.log('click blocker!');
      e.stopPropagation()
    }}/>
    </>
  );
}
