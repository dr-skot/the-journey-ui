import React, { useContext } from 'react';
import FlexibleGallery from './FlexibleGallery';
import { AppContext } from '../../contexts/AppContext';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import { inGroup } from '../../utils/twilio';

export default function FocusGroup() {
  const [{ focusGroup }] = useContext(AppContext);
  const group = useGalleryParticipants({ withMuppets: true }).filter(inGroup(focusGroup));

  return <FlexibleGallery participants={group} />
}
