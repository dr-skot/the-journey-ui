import { sortBy } from 'lodash';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { padWithMuppets } from '../../../mockup/Muppet';
import { GALLERY_SIZE } from '../FixedGallery';
import { getParticipants, getTimestamp, isAmong, isRole } from '../../../utils/twilio';
import { and, not } from '../../../utils/functional';

// TODO sort by entry time

export interface MuppetOption {
  withMuppets?: boolean;
  withMe?: boolean;
  inLobby?: boolean;
}

export default function useGalleryParticipants({ withMuppets, withMe, inLobby }: MuppetOption = {}) {
  const [{ room, participants, admitted, rejected }] = useContext(AppContext);

  const otherFolks = Array.from(participants.values());
  const allFolks = withMe && room ? [room.localParticipant, ...otherFolks] : otherFolks;

  let gallery = allFolks.filter(
    and(
      isRole('audience'),
      not(isAmong(rejected)),
      inLobby ? not(isAmong(admitted)) : isAmong(admitted)
    )
  );

  gallery = sortBy(gallery, getTimestamp);
  gallery = withMuppets ? padWithMuppets(GALLERY_SIZE)(gallery) : gallery;

  return gallery;
}
