import FlexibleGallery from '../Gallery/FlexibleGallery';
import React from 'react';
import { isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';

export default function Stage() {
  const star = useParticipants().find(isRole('star'));
  return star ? <FlexibleGallery participants={[star]}/> : null;
}
