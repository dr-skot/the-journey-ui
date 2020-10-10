import useParticipants from './useParticipants/useParticipants';
import { inGroups, isRole } from '../utils/twilio';
import { useAppState } from '../contexts/AppStateContext';
import { and, not } from '../utils/functional';

export default function useAudience() {
  const [{ helpNeeded, notReady, excluded, meetings }] = useAppState();
  return useParticipants()
    .filter(and(
      isRole('audience'),
      not(inGroups([notReady, excluded, helpNeeded, ...meetings]))
    ));
}
