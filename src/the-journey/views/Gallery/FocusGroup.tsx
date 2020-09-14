import React, { useContext } from 'react';
import FlexibleGallery from './FlexibleGallery';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { SharedRoomStateContext } from '../../contexts/SharedRoomStateContext';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';

export default function FocusGroup() {
  const [{ focusGroup }] = useContext(SharedRoomStateContext);
  const group = useGalleryParticipants({ withMuppets: true, withMe: true }).filter(inGroup(focusGroup));

  // console.log('FocusGroup view here. I think focus group is', focusGroup);

  const final = cached('FocusGroup').if(sameIdentities)(group) as Participant[];
  return <FlexibleGallery participants={final} />
}
