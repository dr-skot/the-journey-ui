import { useAppContext } from '../contexts/AppContext';
import useParticipants from '../hooks/useParticipants/useParticipants';
import { getIdentities, isRole } from '../utils/twilio';
import { useEffect } from 'react';

export default function SubscribeToStar() {
  const [{ room }, dispatch] = useAppContext();
  const stars = useParticipants().filter(isRole('star'));

  useEffect(() =>
      dispatch('subscribe', { profile: 'focus', focus: getIdentities(stars) }),
    [room, stars]);
  return null;
}
