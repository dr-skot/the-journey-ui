import React, { useContext } from 'react';
import FlexibleGallery from './FlexibleGallery';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import { inGroup } from '../../utils/twilio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';

export default function FocusGroup() {
  const [{ focusGroup }] = useContext(SharedRoomContext);
  const group = useGalleryParticipants({ withMuppets: true }).filter(inGroup(focusGroup));

  return <FlexibleGallery participants={group} />
}
