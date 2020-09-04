import FlexibleGallery from '../Gallery/FlexibleGallery';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { getStar, isRole } from '../../utils/twilio';

export default function Stage() {
  const [{ participants }] = useContext(AppContext);
  const star = getStar(participants);
  return star ? <FlexibleGallery participants={[star]}/> : null;
}
