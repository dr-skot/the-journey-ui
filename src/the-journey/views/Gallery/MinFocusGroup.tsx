import React, { useContext, useEffect, useState } from 'react';
import FlexibleGallery from './FlexibleGallery';
import { inGroup, sameIdentities } from '../../utils/twilio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupVideoAndAudio from '../../subscribers/SubscribeToFocusGroupVideoAndAudio';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import Facts from '../Min/Facts';
import { Button } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import MenuedView from './MenuedView';

export const Floater = styled('div')({
  position: 'absolute',
  top: 10,
  left: 100,
  textAlign: 'center',
  zIndex: 10000000000000,
});

function MinFocusGroupView() {
  const [{ focusGroup }] = useContext(SharedRoomContext);
  const group = useParticipants().filter(inGroup(focusGroup));
  useRerenderOnTrackSubscribed();

  const final = cached('FocusGroup').if(sameIdentities)(group) as Participant[];
  return <MenuedView><FlexibleGallery participants={final} /></MenuedView>
}

export default function MinFocusGroup() {
  const [justFacts, setJustFacts] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isFullScreen] = useFullScreenToggle();

  return (
    <>
      <SubscribeToFocusGroupVideoAndAudio/>
      { !muted && <PlayAllSubscribedAudio/>}
      { justFacts ? <Facts /> : <MinFocusGroupView /> }
      { !isFullScreen && <Floater>
        <Button onClick={() => setJustFacts((prev) => !prev)} variant="contained" color="primary">
          {justFacts ? 'view' : 'facts'}
        </Button>
        <Button onClick={() => setMuted((prev) => !prev)} variant="contained">
          {muted ? 'unmute' : 'mute'}
        </Button>
      </Floater> }
    </>
  );
}
