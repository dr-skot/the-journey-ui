import { useContext, useEffect } from 'react';
import { isDev } from '../utils/react-help';
import { AppContext } from '../contexts/AppContext';
import { defaultRoom, getIdentity, SubscribeProfile, UserRole } from '../utils/twilio';
import { useRouteMatch, match } from 'react-router-dom';

interface AutoJoinProps {
  roomName?: string,
  username?: string,
  role?: UserRole,
  profile?: SubscribeProfile
  children?: any,
}

export default function AutoJoin({ roomName, username, role = 'lurker', profile = 'gallery',
                                   children }: AutoJoinProps) {
  const [{ room }, dispatch] = useContext(AppContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  console.log('AutoJoin', {
    role,
    roomName: roomNameReally,
    identity: getIdentity(role, username),
    match,
    code: match.params.code
  });

  useEffect(() => {
    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, subscriberProfile: profile
    });
  }, []);

  return room ? children || null : null;
}
