import { sortBy } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Participant } from 'twilio-video';
import { not } from '../../../utils/functional';
import { padWithMuppets } from '../../../mockup/Muppet';
import { GALLERY_SIZE } from '../FixedGallery';

// TODO sort by entry time

export interface MuppetOption {
  withMuppets?: boolean;
}

// TODO safer way to identify them, and consolidate to a single (un-form-inputtable?) prefix
export const isBackstage = (participant: Participant) =>
  !!participant.identity.match(/^(admin|gallery|operator|backstage)/);

export default function useGalleryParticipants({ withMuppets }: MuppetOption = {}) {
  const [{ participants }] = useContext(AppContext);
  const [gallery, setGallery] = useState<Participant[]>([]);

  // TODO stabilize order somehow
  useEffect(() => {
    let folks = Array.from(participants.values()).filter(not(isBackstage));
    folks = sortBy(folks, 'sid');
    setGallery(withMuppets ? padWithMuppets(GALLERY_SIZE)(folks) : folks);
  }, [participants, withMuppets]);

  return gallery;
}
