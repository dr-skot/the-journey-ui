import React from 'react';
import { styled } from '@material-ui/core';

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
  return (
    <>
      <Container>
    <iframe title="millicast"
      src="https://viewer.millicast.com/v2?streamId=wbfwt8/ke434gcy&muted=true&autoPlay=true"
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
