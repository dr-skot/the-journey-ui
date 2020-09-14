import { useSharedRoomState } from '../contexts/SharedRoomStateContext';
import { useAppContext } from '../contexts/AppContext';

export default function useMeetup() {
  const [{ room }] = useAppContext();
  const [{ meetups }] = useSharedRoomState();
  const meetup = room
    ? meetups.find((group) => group.includes(room.localParticipant.identity))
    : undefined;
  return { meetup };
}
