import React from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { cached } from '../../utils/react-help';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import SubscribeToFocusGroupVideoAndAudio from '../../subscribers/SubscribeToFocusGroupVideoAndAudio';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import FlexibleGallery from './FlexibleGallery';
import MenuedView from './MenuedView';
import WithFacts from '../Min/WithFacts';

function MinFocusGroupView() {
  const [{ focusGroup }] = useSharedRoomState();
  const group = sortBy(
    useParticipants().filter(inGroup(focusGroup)),
    (p) => focusGroup.indexOf(p.identity)
  );
  useRerenderOnTrackSubscribed();

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
