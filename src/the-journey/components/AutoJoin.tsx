import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { defaultRoom, SubscribeProfile, UserRole } from '../utils/twilio';
import { useRouteMatch, match } from 'react-router-dom';

interface AutoJoinProps {
  roomName?: string,
  username?: string,
  role?: UserRole,
  profile?: SubscribeProfile
  children?: any,
}

const AutoJoin = React.memo(({ roomName, username, role = 'lurker', profile = 'gallery',
                                   children }: AutoJoinProps) => {
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  useEffect(() => {
    if (['connected', 'connecting'].includes(roomStatus)) return;

    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, subscriberProfile: profile
    });
    // eslint-disable-next-line
  }, [roomStatus]);

  return roomStatus === 'connected' ? children || null : null;
});
AutoJoin.whyDidYouRender = false;

export default AutoJoin;
