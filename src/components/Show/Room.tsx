import React from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100%',
}));

const Floater = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: theme.sidebarWidth,
}));

export default function Room() {
  console.log('render Room')
  return (
    <Container>
      <Floater>
        <SidebarSelfie />
      </Floater>
      <video style={{width: '100%'}} src={`${process.env.PUBLIC_URL}/trailer.m4v`} autoPlay />
    </Container>
  );
}
