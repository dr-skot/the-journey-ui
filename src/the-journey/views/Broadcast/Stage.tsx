import FlexibleGallery from '../Gallery/FlexibleGallery';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function Stage() {
  const [{ starParticipant }] = useContext(AppContext);
  return starParticipant ? <FlexibleGallery participants={[starParticipant!]}/> : null;
}
