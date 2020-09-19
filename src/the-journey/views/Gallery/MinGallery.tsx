import React, { useState } from 'react';
import MenuedView from './MenuedView';
import WithFacts from '../Entry/WithFacts';
import FlexibleGallery, { GALLERY_SIZE } from './FlexibleGallery';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { isRole } from '../../utils/twilio';
import { Button } from '@material-ui/core';
import Subscribe from '../../subscribers/Subscribe';

interface GalleryProps {
  hideBlanks?: boolean
}
export function Gallery({ hideBlanks }: GalleryProps) {
  const participants = useParticipants().filter(isRole('audience'));
  return <FlexibleGallery participants={participants}
                          fixedLength={hideBlanks ? undefined : GALLERY_SIZE}
                          blanks="nothing"/>;
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
      <Subscribe profile="gallery" />
      <WithFacts>
        <MenuedView menuExtras={menuExtras}>
          <Gallery hideBlanks={hideBlanks} />
        </MenuedView>
      </WithFacts>
    </>
  );
}
