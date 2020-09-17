import { useSharedRoomState } from '../contexts/SharedRoomContext';
import { useAppContext } from '../contexts/AppContext';

export default function useMeeting() {
  const [{ room }] = useAppContext();
  const [{ meetings }, changeSharedState] = useSharedRoomState();
  const myIdentity = room?.localParticipant.identity || '';

  const meeting = room
    ? meetings.find((group) => group.includes(myIdentity))
    : undefined;

  return { meeting };
}
