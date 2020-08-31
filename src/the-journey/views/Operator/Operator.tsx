import useOperatorControls from '../Gallery/hooks/useOperatorControls';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';

export default function Operator() {
  const { forceGallery, hotKeys, toggleFocus } = useOperatorControls();
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
  const participantsArray = Array.from(participants.values()).filter(p => !p.identity.match(/^admin/));

  return (
    <>
      <MenuBar isOperator/>
      <div>
    <FlexibleGallery
      participants={participantsArray.filter(focusing ? p => focusGroup.includes(p.identity) : p => true)}
      selection={focusing ? [] :focusGroup}
      fixedLength={focusing ? undefined : GALLERY_SIZE}
      hotKeys={hotKeys}
      mute={focusGroup.length > 0}
      onClick={toggleFocus}
    />
      </div>
    </>
  );
}
