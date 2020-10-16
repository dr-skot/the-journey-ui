import React, { useState } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { cached } from '../../utils/react-help';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { useAppState } from '../../contexts/AppStateContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuedView from '../MenuedView';
import WithFacts from '../Facts/WithFacts';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import { Button } from '@material-ui/core';
import Subscribe from '../../subscribers/Subscribe';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import SubscribeToFocusGroupAudioMinusMuted from '../../subscribers/SubscribeToFocusGroupAudioMinusMuted';

function FocusGroupView() {
  const [{ focusGroup }] = useAppState();
  const group = sortBy(
    useParticipants().filter(inGroup(focusGroup)),
    (p) => focusGroup.indexOf(p.identity)
  );
  useRerenderOnTrackSubscribed();
  const [safer, setSafer] = useState(false);

  const menuExtras = (
    <>
      Audio: {safer ? 'subscribed to all' : 'as needed'}
    <Button
      onClick={() => setSafer((prev) => !prev)}
      style={{ margin: '0.5em' }}
      size="small" color="default" variant="contained"
    >
      {`${safer ? 'as needed' : 'subscribe to all'}`}
    </Button>
   </>
  )

  const final = cached('FocusGroupView.final').if(sameIdentities)(group) as Participant[];
  return (
    <MenuedView menuExtras={menuExtras}>
      <SubscribeToFocusGroupAudioMinusMuted/>
      <FlexibleGallery participants={final} />
    </MenuedView>
  );
}

export default function FocusGroup3() {
  return <>
    <PlayAllSubscribedAudio/>
    <WithFacts>
      <FocusGroupView />
    </WithFacts>
  </>
}
