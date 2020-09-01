import FlexibleGallery from '../Gallery/FlexibleGallery';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function FocusGroup() {
  const [{ focusGroup }] = useContext(AppContext);

  return (
    <FlexibleGallery
      participants={useGalleryParticipants().filter(p => focusGroup.includes(p.identity))}
    />
  );
}
