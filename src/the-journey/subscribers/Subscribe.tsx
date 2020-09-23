import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { useEffect } from 'react';
import { SubscribeProfile } from '../utils/twilio';
import { Participant } from 'twilio-video';

interface SubscribeProps {
  profile: SubscribeProfile,
  focus?: Participant.Identity[],
  stars?: Participant.Identity[],
}

export default function Subscribe({ profile, focus, stars }: SubscribeProps) {
  const [{ roomStatus }, dispatch] = useTwilioRoomContext();

  // watch room status so we resubscribe after reconnect
  useEffect(() => {
      if (roomStatus === 'connected') dispatch('subscribe', { profile, focus, stars });
    },[roomStatus, profile, focus, stars, dispatch]);

  return null;
}
