import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import SignIn from '../Entry/SignIn';
import Meeting from './Meeting';
import useMeeting from '../../hooks/useMeeting';
import WithFacts from '../Facts/WithFacts';
import MenuedView from '../MenuedView';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';
import { defaultRoom, isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import FlexibleGallery, { GALLERY_SIZE } from '../Gallery/FlexibleGallery';
import Subscribe from '../../subscribers/Subscribe';

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
      <Subscribe profile="data-only" />
      <MenuedView>
        <Gallery />
      </MenuedView>
    </WithFacts>
  )
}

interface GalleryProps {
  hideBlanks?: boolean
}
export function Gallery({ hideBlanks }: GalleryProps) {
  const participants = useParticipants().filter(isRole('audience'));
  return <FlexibleGallery participants={participants}
                          fixedLength={hideBlanks ? undefined : GALLERY_SIZE}
                          blanks="nothing"/>;
}
