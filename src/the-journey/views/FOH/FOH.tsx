import React, { ReactNode } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import SignIn from './SignIn';
import Meeting from './Meeting';
import useMeeting from '../../hooks/useMeeting';
import WithFacts from '../Facts/WithFacts';
import MenuedView from '../MenuedView';
import { isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import FlexibleGallery, { GALLERY_SIZE } from '../Gallery/FlexibleGallery';
import Subscribe from '../../subscribers/Subscribe';
import useRoomName from '../../hooks/useRoomName';
import useChat from '../../hooks/useChat';
import PlayAudioTracks from '../../components/audio/PlayAudioTracks';

export default function FOH() {
  const [{ roomStatus }] = useTwilioRoomContext();
  const roomName = useRoomName();

  return roomStatus !== 'disconnected'
    ? <FOHView />
    : <SignIn roomName={roomName} role="foh" options={{ maxTracks: '0' }} />;
}


function FOHView() {
  const { meeting } = useMeeting();
  const chat = useChat('foh');

  return meeting ? <Meeting group={meeting} /> : <FOHGallery chat={chat} />;
}

function FOHGallery({ chat }: { chat: ReactNode }) {
  // initialize by subscribing to data only
  // FOH controls may punch in to audio and video feeds
  return (
    <WithFacts>
      <Subscribe profile="data-only" />
      <PlayAudioTracks/>
      <MenuedView>
        <Gallery />
        { chat }
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
