import { useContext, useEffect, useState } from 'react';
import { Participant, RemoteParticipant } from 'twilio-video';
import { AppContext } from '../../contexts/AppContext';
import { getTimestamp, sameIdentities } from '../../utils/twilio';
import { sortBy } from 'lodash';
import { cached } from '../../utils/react-help';

export default function useParticipants(includeMe?: 'includeMe') {
  const appContext = useContext(AppContext);
  const [{ room }] = appContext;
  const [participants, setParticipants] = useState(Array.from(room?.participants.values() || []));


  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      console.log('useParticipants: new connection! updating')
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    }
    const participantDisconnected = (participant: RemoteParticipant) => {
      console.log('useParticipants: somebody left! updating');
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
    }
    room?.on('participantConnected', participantConnected);
    room?.on('participantDisconnected', participantDisconnected);
    return () => {
      room?.off('participantConnected', participantConnected);
      room?.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  const everybody = includeMe ? [room?.localParticipant, ...participants] : participants;
  const sorted = sortBy(everybody, getTimestamp);
  const final = cached('useParticipants').if(sameIdentities)(sorted) as Participant[];

  console.log('useParticipants returning', final === sorted ? 'uncached' : 'cached', { final });

  return final
}
