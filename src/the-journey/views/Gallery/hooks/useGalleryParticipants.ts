import { sortBy } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Participant } from 'twilio-video';
import { not } from '../../../utils/functional';
import { padWithMuppets } from '../../../mockup/Muppet';
import { GALLERY_SIZE } from '../FixedGallery';
import { getParticipants, isRole } from '../../../utils/twilio';

// TODO sort by entry time

export interface MuppetOption {
  withMuppets?: boolean;
  withMe?: boolean;
}

export default function useGalleryParticipants({ withMuppets, withMe }: MuppetOption = {}) {
  const [{ room, participants, starIdentity }] = useContext(AppContext);

  const otherFolks = Array.from(participants.values());
  const allFolks = withMe && room ? [room.localParticipant, ...otherFolks] : otherFolks;

  console.log('all folks', { allFolks });

  let gallery = allFolks.filter(isRole('audience'))
    .filter(p => p.identity !== starIdentity);
  gallery = sortBy(gallery, 'sid');
  gallery = withMuppets ? padWithMuppets(GALLERY_SIZE)(gallery) : gallery;

  return gallery;
}
