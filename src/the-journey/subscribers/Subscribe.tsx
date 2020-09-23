import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { useEffect } from 'react';
import { SubscribeProfile } from '../utils/twilio';
import { Participant } from 'twilio-video';

interface SubscribeProps {
  profile: SubscribeProfile,
  focus?: Participant.Identity[]
}

export default function Subscribe({ profile, focus }: SubscribeProps) {
  const [{ roomStatus }, dispatch] = useTwilioRoomContext();

  // watch room status so we resubscribe after reconnect
  useEffect(() => {
      if (roomStatus === 'connected') dispatch('subscribe', { profile, focus });
    },[roomStatus, profile, focus, dispatch]);

  return null;
}
