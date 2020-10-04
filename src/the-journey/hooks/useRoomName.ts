import { defaultRoom } from '../utils/twilio';
import useCode from './useCode';

export default function useRoomName() {
  return useCode() || defaultRoom();
}
