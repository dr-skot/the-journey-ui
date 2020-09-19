import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';
import { SubscribeProfile } from '../utils/twilio';
import { Participant } from 'twilio-video';

interface SubscribeProps {
  profile: SubscribeProfile,
  focus?: Participant.Identity[]
}

export default function Subscribe({ profile, focus }: SubscribeProps) {
  const [{ roomStatus }, dispatch] = useAppContext();

  // watch room status so we resubscribe after reconnect
  useEffect(() => {
      if (roomStatus === 'connected') dispatch('subscribe', { profile, focus });
    },[roomStatus, profile, focus]);

  return null;
}
