import React, { useState } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { cached } from '../../utils/react-help';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import FlexibleGallery from './FlexibleGallery';
import MenuedView from './MenuedView';
import WithFacts from '../Entry/WithFacts';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import SubscribeToFocusGroupVideoAndAllAudio from '../../subscribers/SubscribeToFocusGroupVideoAndAllAudio';
import SubscribeToFocusGroupVideoAndAudio from '../../subscribers/SubscribeToFocusGroupVideoAndAudio';
import { Button } from '@material-ui/core';

function MinFocusGroupView() {
  const [{ focusGroup }] = useSharedRoomState();
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



  const final = cached('FocusGroup').if(sameIdentities)(group) as Participant[];
  return (
    <MenuedView menuExtras={menuExtras}>
      { safer ? <SubscribeToFocusGroupVideoAndAllAudio/> : <SubscribeToFocusGroupVideoAndAudio/> }
      <FlexibleGallery participants={final} />
    </MenuedView>
  );
}

export default function MinFocusGroup() {
  return (
    <>
      <FocusGroupAudio/>
      <WithFacts>
        <MinFocusGroupView />
      </WithFacts>
    </>
  );
}
