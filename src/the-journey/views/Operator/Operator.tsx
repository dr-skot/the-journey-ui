import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { Participant } from 'twilio-video';
import useOperatorMessaging from './hooks/useOperatorMessaging';

export default function Operator() {
  const { forceGallery, forceHotKeys, toggleFocus } = useOperatorControls();
  const [{ room, audioDelay, participants, focusGroup, starParticipant }, dispatch] = useContext(AppContext);

  useOperatorMessaging();

  const focusing = focusGroup.length && !forceGallery;

  const handleClick = (e: MouseEvent, participant: Participant) => {
    // TODO star's video priority should be high -- look at dominant speaker code
    if (e.altKey) dispatch('toggleStar', { star: participant });
    else toggleFocus?.(participant);
  }

  return (
    <>
      <MenuBar isOperator/>
      <div>
    <FlexibleGallery
      participants={useGalleryParticipants().filter(p => focusing ? focusGroup.includes(p.identity) : true)}
      selection={focusing ? [] : focusGroup}
      star={starParticipant}
      fixedLength={focusing ? undefined : GALLERY_SIZE}
      hotKeys={!focusing || forceHotKeys ? KEYS : ''}
      mute={true}
      onClick={handleClick}
    />
      </div>
    </>
  );
}
