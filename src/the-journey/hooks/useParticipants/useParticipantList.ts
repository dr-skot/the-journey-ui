import { useEffect, useState } from 'react';
import { getParticipantList } from '../../utils/twilio';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';

export default function useParticipantList(roomName: string, retryTimeout: number = 1000) {
  const [list, setList] = useState<Participant[]>()

  useEffect(() => {
    const update = () => { getParticipantList(roomName).then(setList) };
    update();
    const intervalId = setInterval(update, retryTimeout);
    return () => clearInterval(intervalId);
  }, [roomName, retryTimeout, setList]);

  return cached('useParticipantList.result').ifEqual(list) as Participant[];
}
