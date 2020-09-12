import React from 'react';
import MenuedView from './MenuedView';
import WithFacts from '../Min/WithFacts';
import FlexibleGallery from './FlexibleGallery';
import { GALLERY_SIZE } from './FixedGallery';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';
import SubscribeToAllVideo from '../../subscribers/SubscribeToAllVideo';

function Gallery() {
  const participants = useParticipants().filter(isRole('audience'));
  return <FlexibleGallery participants={participants} fixedLength={GALLERY_SIZE} blanks="black"/>;
}

export default function MinGallery() {
  return (
    <>
      <SubscribeToAllVideo />
      <WithFacts>
        <MenuedView>
          <Gallery />
        </MenuedView>
      </WithFacts>
    </>
  );
}
