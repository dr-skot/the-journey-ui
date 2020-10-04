import useParticipants from './useParticipants/useParticipants';
import { inGroup, isRole } from '../utils/twilio';
import { useAppState } from '../contexts/AppStateContext';
import { and, not } from '../utils/functional';

export default function useAudience() {
  const [{ helpNeeded, meetable }] = useAppState();
  return useParticipants()
    .filter(and(inGroup(meetable), not(inGroup(helpNeeded))));
}
