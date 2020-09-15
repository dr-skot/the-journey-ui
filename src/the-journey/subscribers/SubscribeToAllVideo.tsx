import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';
import { Participant } from 'twilio-video';

interface SubscribeToAllVideoProps {
  listen?: Participant.Identity[]
}
export default function SubscribeToAllVideo({ listen }: SubscribeToAllVideoProps) {
  const [{ room }, dispatch] = useAppContext();

  useEffect(() => {
    if (room) dispatch('subscribe', { profile: 'gallery', focus: listen });
    }, [room, listen, dispatch]);

  return null;
}
