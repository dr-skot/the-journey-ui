import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { useEffect } from 'react';
import { SubscribeProfile } from '../utils/twilio';
import { Participant } from 'twilio-video';
import { cached } from '../utils/react-help';

interface SubscribeProps {
  profile: SubscribeProfile,
  focus?: Participant.Identity[],
  stars?: Participant.Identity[],
}

export default function Subscribe({ profile, focus, stars }: SubscribeProps) {
  const [{ roomStatus }, dispatch] = useTwilioRoomContext();

  // avoid redundant API fetches by caching focus list
  const cachedFocus = cached('Subscribe.focus')
    .ifEqual([...(focus || [])].sort()) as string[];

  // watch room status so we resubscribe after reconnect
  useEffect(() => {
      if (roomStatus === 'connected') dispatch('subscribe', { profile, cachedFocus, stars });
    },[roomStatus, profile, cachedFocus, stars, dispatch]);

  return null;
}
