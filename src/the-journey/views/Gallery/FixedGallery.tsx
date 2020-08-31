import React, { useContext, useEffect, useState } from 'react';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from './FlexibleGallery';
import MenuBar from './components/MenuBar';

export const GALLERY_SIZE = 30;
export const ASPECT_RATIO = 16/9;

export default function FixedGallery() {
  const [, dispatch] = useContext(AppContext);
  const participants = useGalleryParticipants();

  // TODO move this elsewhere and provide fallback alternatives
  useEffect(() => {
    dispatch('subscribe', { policy: 'gallery' });
  }, [dispatch]);

  return (
    <>
      <MenuBar/>
      <FlexibleGallery participants={participants} fixedLength={undefined}/>
    </>
  );
}

