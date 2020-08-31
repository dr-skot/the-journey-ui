import useOperatorControls, { KEYS } from '../Gallery/hooks/useOperatorControls';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';

export default function Operator() {
  const { forceGallery, forceHotKeys, toggleFocus } = useOperatorControls();
  const [{ room, audioDelay, participants, focusGroup }, dispatch] = useContext(AppContext);

  // TODO where should this live?
  useEffect(() => { if (room) dispatch('publishDataTrack') }, [room, dispatch]);

  // TODO where should this live?
  // sync data (that's not presently at default values) when new participants arrive
  // give them a couple of seconds to subscribe to the data channel
  useEffect(() => {
    if (focusGroup.length) setTimeout(() => dispatch('broadcast', { focusGroup }), 2000);
    if (audioDelay) setTimeout(() => dispatch('broadcast', { audioDelay }), 2000);
  }, [participants, dispatch]);

  const focusing = focusGroup.length && !forceGallery;
  // TODO look for video tracks instead

  return (
    <>
      <MenuBar isOperator/>
      <div>
    <FlexibleGallery
      participants={useGalleryParticipants().filter(p => focusing ? focusGroup.includes(p.identity) : true)}
      selection={focusing ? [] : focusGroup}
      fixedLength={focusing ? undefined : GALLERY_SIZE}
      hotKeys={!focusing || forceHotKeys ? KEYS : ''}
      mute={focusGroup.length > 0}
      onClick={toggleFocus}
    />
      </div>
    </>
  );
}
