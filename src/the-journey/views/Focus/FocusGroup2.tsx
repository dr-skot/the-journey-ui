import React from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { cached } from '../../utils/react-help';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { useAppState } from '../../contexts/AppStateContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuedView from '../MenuedView';
import WithFacts from '../Facts/WithFacts';
import PlayFocusGroupAudio from '../../components/audio/PlayFocusGroupAudio';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import Subscribe from '../../subscribers/Subscribe';

function FocusGroupView() {
  const [{ focusGroup }] = useAppState();
  const group = sortBy(
    useParticipants().filter(inGroup(focusGroup)),
    (p) => focusGroup.indexOf(p.identity)
  );
  useRerenderOnTrackSubscribed();

  const final = cached('FocusGroup').if(sameIdentities)(group) as Participant[];
  return (
    <MenuedView>
      <Subscribe profile="everything"/>
      <FlexibleGallery participants={final} />
    </MenuedView>
  );
}

export default function FocusGroup2() {
  return (
    <>
      <PlayFocusGroupAudio/>
      <WithFacts>
        <FocusGroupView />
      </WithFacts>
    </>
  );
}
