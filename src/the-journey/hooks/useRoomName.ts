// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';
import { defaultRoom } from '../utils/twilio';

export default function useRoomName() {
  const match = useRouteMatch() as match<{ code?: string }>;
  return match.params.code || defaultRoom();
}
