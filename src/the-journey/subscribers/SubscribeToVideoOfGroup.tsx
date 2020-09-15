import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';
import { Participant } from 'twilio-video';

interface SubscribeToAllVideoProps {
  group?: Participant.Identity[]
}
export default function SubscribeToVideoOfGroup({ group }: SubscribeToAllVideoProps) {
  const [{ room }, dispatch] = useAppContext();

  console.log('subscribe to video of group', group);
  useEffect(() =>
    dispatch('subscribe', { profile: 'watch', focus: group }),
    [room, group]);
  return null;
}
