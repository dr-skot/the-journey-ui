import { sortBy } from 'lodash';
import useParticipants from '../../../../hooks/useParticipants/useParticipants';

// TODO sort by entry time

export default function useGalleryParticipants() {
  return sortBy(
    useParticipants().filter((p) => !p.identity.match(/^admin-/)),
    'sid',
  );
}
