import React, { useContext, useEffect, useState } from 'react';
import FlexibleGallery from './FlexibleGallery';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupVideoAndAudio from '../../subscribers/SubscribeToFocusGroupVideoAndAudio';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import MenuedView from './MenuedView';
import WithFacts from '../Min/WithFacts';

function MinFocusGroupView() {
  const [{ focusGroup }] = useContext(SharedRoomContext);
  const group = useParticipants().filter(inGroup(focusGroup));
  useRerenderOnTrackSubscribed();

  // TODO preserve focus group order

  const final = cached('FocusGroup').if(sameIdentities)(group) as Participant[];
  return <MenuedView><FlexibleGallery participants={final} /></MenuedView>
}

export default function MinFocusGroup() {
  return (
    <>
      <SubscribeToFocusGroupVideoAndAudio/>
      <PlayAllSubscribedAudio/>
      <WithFacts>
        <MinFocusGroupView />
      </WithFacts>
    </>
  );
}
