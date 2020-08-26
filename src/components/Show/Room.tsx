import React from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100%',
}));

const Main = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
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
      <Main>
        <video style={{width: '100%'}} src={`${process.env.PUBLIC_URL}/trailer.m4v`} autoPlay controls />
      </Main>
    </Container>
  );
}
