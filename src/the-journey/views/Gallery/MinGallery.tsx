import React, { useState } from 'react';
import MenuedView from './MenuedView';
import WithFacts from '../Min/WithFacts';
import FlexibleGallery from './FlexibleGallery';
import { GALLERY_SIZE } from './FixedGallery';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';
import SubscribeToAllVideo from '../../subscribers/SubscribeToAllVideo';
import { Button } from '@material-ui/core';

interface GalleryProps {
  hideBlanks?: boolean
}
export function Gallery({ hideBlanks }: GalleryProps) {
  const participants = useParticipants().filter(isRole('audience'));
  return <FlexibleGallery participants={participants}
                          fixedLength={hideBlanks ? undefined : GALLERY_SIZE}
                          blanks="black"/>;
}

export default function MinGallery() {
  const [hideBlanks, setHideBlanks] = useState(false);
  const menuExtras = (
    <Button
      onClick={() => setHideBlanks((prev) => !prev)}
      style={{ margin: '0.5em' }}
      size="small" color="default" variant="contained"
    >
      {`${hideBlanks ? 'show' : 'hide'} blanks`}
    </Button>
  )

  return (
    <>
      <SubscribeToAllVideo />
      <WithFacts>
        <MenuedView menuExtras={menuExtras}>
          <Gallery hideBlanks={hideBlanks} />
        </MenuedView>
      </WithFacts>
    </>
  );
}
