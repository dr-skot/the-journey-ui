import React from 'react';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import FlexibleGallery from './FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
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
  const participants = useGalleryParticipants();

  return (
    <Container>
      <MenuBar/>
      <Main>
        <FlexibleGallery participants={participants} fixedLength={GALLERY_SIZE} blanks="black"/>
      </Main>
    </Container>
  );
}

