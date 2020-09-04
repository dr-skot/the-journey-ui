import React, { useContext, useEffect } from 'react';
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

let joinCount = 0;
let renderCount = 0;

const AutoJoin = React.memo(({ roomName, username, role = 'lurker', profile = 'gallery',
                                   children }: AutoJoinProps) => {
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  renderCount += 1;
  // console.log('AutoJoin render', renderCount, 'join count', joinCount);

  useEffect(() => {
    if (['connected', 'connecting'].includes(roomStatus)) return;
    joinCount += 1;
    // console.log('AutoJoin', ++joinCount, roomNameReally, getIdentity(role, username));
    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, subscriberProfile: profile
    });
  }, [roomStatus]);

  return roomStatus === 'connected' ? children || null : null;
});
AutoJoin.whyDidYouRender = false;

export default AutoJoin;
