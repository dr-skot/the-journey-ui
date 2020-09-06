import { sortBy } from 'lodash';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { padWithMuppets } from '../../../components/Participant/Muppet';
import { GALLERY_SIZE } from '../FixedGallery';
import { getTimestamp, isAmong, isRole } from '../../../utils/twilio';
import { and, not } from '../../../utils/functional';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import { SharedRoomContext } from '../../../contexts/SharedRoomContext';

// TODO sort by entry time

export interface MuppetOption {
  withMuppets?: boolean;
  withMe?: boolean;
  inLobby?: boolean;
}

export default function useGalleryParticipants({ withMuppets, withMe, inLobby }: MuppetOption = {}) {
  const [{ room }] = useContext(AppContext);
  const [{ admitted, rejected }] = useContext(SharedRoomContext);
  const participants = useParticipants();

  const allFolks = withMe && room ? [room.localParticipant, ...participants] : participants;

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
