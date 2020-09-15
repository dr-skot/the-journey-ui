import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from '../Min/SignIn';
import { Gallery } from '../Gallery/MinGallery';
import Meetup from './Meetup';
import useMeetup from '../../hooks/useMeetup';
import WithFacts from '../Min/WithFacts';
import MenuedView from '../Gallery/MenuedView';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import { ROOM_NAME } from '../../../App';

export default function MinFOH() {
  const [{ roomStatus }] = useAppContext();
  const roomName = ROOM_NAME;

  return roomStatus === 'connected'
    ? <FOHView />
    : <SignIn roomName={roomName} role="foh" options={{ maxTracks: '0' }} />;
}


function FOHView() {
  const { meetup } = useMeetup();
  // TODO should PlayAllSubscribedAudio live in App.jsx?
  return (
    <>
      <PlayAllSubscribedAudio />
      { meetup ? <Meetup group={meetup} /> : <FOHGallery /> }
    </>
  );
}

function FOHGallery() {
  const [, dispatch] = useAppContext();

  // initialize by subscribing to gallery
  // FOH controls may punch in to audio feeds
  useEffect(() => dispatch('subscribe', { profile: 'gallery' }), [])

  return (
    <WithFacts>
      <MenuedView>
        <Gallery />
      </MenuedView>
    </WithFacts>
  )
}
