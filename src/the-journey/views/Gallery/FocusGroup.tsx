import React, { useContext } from 'react';
import FlexibleGallery from './FlexibleGallery';
import { AppContext } from '../../contexts/AppContext';
import { inGroup } from '../Operator/PaddingOperator';
import useGalleryParticipants from './hooks/useGalleryParticipants';

export default function FocusGroup() {
  const [{ focusGroup }] = useContext(AppContext);
  const group = useGalleryParticipants({ withMuppets: true }).filter(inGroup(focusGroup));

  console.log('FocusGroup render', { focusGroup, group });
  return <FlexibleGallery participants={group} />
}
