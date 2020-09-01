import React, { useContext, useEffect, useState } from 'react';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from './FlexibleGallery';
import MenuBar from './components/MenuBar';
import { styled } from '@material-ui/core/styles';

export const GALLERY_SIZE = 30;
export const ASPECT_RATIO = 16/9;

const Container = styled('div')({
  display: 'flex',
  flexFlow: 'column',
  height: '100%',
});

const Main = styled('div')({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
});


export default function FixedGallery() {
  const [, dispatch] = useContext(AppContext);
  const participants = useGalleryParticipants();

  // TODO move this elsewhere and provide fallback alternatives
  useEffect(() => {
    dispatch('subscribe', { policy: 'gallery' });
  }, [dispatch]);

  return (
    <Container>
      <MenuBar/>
      <Main>
        <FlexibleGallery participants={participants} fixedLength={undefined}/>
      </Main>
    </Container>
  );
}

