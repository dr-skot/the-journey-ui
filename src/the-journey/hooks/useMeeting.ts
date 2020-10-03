import { useAppState } from '../contexts/AppStateContext';
import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';

export default function useMeeting() {
  const [{ room }] = useTwilioRoomContext();
  const [{ meetings }] = useAppState();
  const myIdentity = room?.localParticipant.identity || '';

  const meeting = room
    ? meetings.find((group) => group.includes(myIdentity))
    : undefined;

  return { meeting };
}
