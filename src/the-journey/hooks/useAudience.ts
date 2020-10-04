import useParticipants from './useParticipants/useParticipants';
import { inGroup, inGroups } from '../utils/twilio';
import { useAppState } from '../contexts/AppStateContext';
import { and, not } from '../utils/functional';

export default function useAudience() {
  const [{ helpNeeded, meetable, meetings }] = useAppState();
  return useParticipants()
    .filter(and(inGroup(meetable), not(inGroup(helpNeeded)), not(inGroups(meetings))));
}
