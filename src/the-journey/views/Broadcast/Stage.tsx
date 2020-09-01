import FlexibleGallery from '../Gallery/FlexibleGallery';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';

export default function Stage() {
  const [{ starIdentity }] = useContext(AppContext);
  const participants = useGalleryParticipants({ withMuppets: true });

  const star = participants.find(p => p.identity === starIdentity);
  return star ? <FlexibleGallery participants={[star]}/> : null;
}
