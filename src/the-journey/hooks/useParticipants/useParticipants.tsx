import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import { useAppContext } from '../../contexts/AppContext';
import { getIdentities, getTimestamp, sameIdentities } from '../../utils/twilio';
import { sortBy } from 'lodash';
import { cached } from '../../utils/react-help';

export default function useParticipants(includeMe?: 'includeMe') {
  const appContext = useAppContext();
  const [{ room }] = appContext;
  const [participants, setParticipants] = useState(Array.from(room?.participants.values() || []));

  console.log('participants', getIdentities(participants).join(', '));

  useEffect(() => {
    console.log('new room!', JSON.stringify(room));
    const update = () => setParticipants(Array.from(room?.participants.values() || []));
    update();
    room?.on('participantConnected', update);
    room?.on('participantDisconnected', update);
    return () => {
      room?.off('participantConnected', update);
      room?.off('participantDisconnected', update);
    };
  }, [room]);

  const everybody = includeMe ? [room?.localParticipant, ...participants] : participants;
  const sorted = sortBy(everybody, getTimestamp);
  const final = cached('useParticipants').if(sameIdentities)(sorted) as Participant[];

  // console.log('useParticipants returning', final === sorted ? 'uncached' : 'cached', { final });

  return final
}
