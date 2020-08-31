import { sortBy } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Participant } from 'twilio-video';

// TODO sort by entry time

export default function useGalleryParticipants() {
  const [{ participants }] = useContext(AppContext);
  const [gallery, setGallery] = useState<Participant[]>([]);

  // TODO stabilize order somehow
  useEffect(() => {
    setGallery(sortBy(
      Array.from(participants.values()).filter((p) => !p.identity.match(/^(admin|gallery|operator)/)),
      'sid',
    ))
  }, [participants]);

  return gallery;
}
