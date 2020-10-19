import useParticipants from '../useParticipants/useParticipants';
import { getIdentities, inGroups, isRole, sortedParticipants } from '../../utils/twilio';
import { useAppState } from '../../contexts/AppStateContext';
import { and, not } from '../../utils/functional';
import { Participant } from 'twilio-video';
import { newStickyMap } from '../../utils/stickySet';

const stickyMap = newStickyMap<Participant>([], 3000);

export default function useStickyAudience() {
  const [{ helpNeeded, notReady, excluded, meetings }] = useAppState();
  const rawAudience = useParticipants()
    .filter(and(
      isRole('audience'),
      not(inGroups([notReady, excluded, helpNeeded, ...meetings]))
    ));
  const audience = stickyMap.update(rawAudience.map((p) => [p.identity, p])).getValues();
  return sortedParticipants(audience);
}
