import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from '../Entry/SignIn';
import { Gallery } from '../Gallery/MinGallery';
import Meeting from './Meeting';
import useMeeting from '../../hooks/useMeeting';
import WithFacts from '../Entry/WithFacts';
import MenuedView from '../Gallery/MenuedView';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import { useRouteMatch, match } from 'react-router-dom';
import { defaultRoom } from '../../utils/twilio';

export default function FOH() {
  const [{ roomStatus }] = useAppContext();
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomName = match.params.code || defaultRoom();

  return roomStatus !== 'disconnected'
    ? <FOHView />
    : <SignIn roomName={roomName} role="foh" options={{ maxTracks: '0' }} />;
}


function FOHView() {
  const { meeting } = useMeeting();
  // TODO should PlayAllSubscribedAudio live in App.jsx?
  return (
    <>
      <PlayAllSubscribedAudio />
      { meeting ? <Meeting group={meeting} /> : <FOHGallery /> }
    </>
  );
}

function FOHGallery() {
  const [, dispatch] = useAppContext();

  // initialize by subscribing to gallery
  // FOH controls may punch in to audio and video feeds
  useEffect(() => dispatch('subscribe', { profile: 'data-only' }), [dispatch])

  return (
    <WithFacts>
      <MenuedView>
        <Gallery />
      </MenuedView>
    </WithFacts>
  )
}
