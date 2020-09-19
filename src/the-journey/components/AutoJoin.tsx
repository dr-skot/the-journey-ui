import React, { useContext, useEffect } from 'react';
import { useRouteMatch, match } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { defaultRoom, SettingsAdjust, UserRole } from '../utils/twilio';

interface AutoJoinProps {
  roomName?: string,
  username?: string,
  role?: UserRole,
  options?: SettingsAdjust,
  children?: any,
}

const AutoJoin = React.memo(({ roomName, username, role = 'lurker', options,
                                   children }: AutoJoinProps) => {
  const [{ roomStatus }, dispatch] = useContext(AppContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  useEffect(() => {
    if (roomStatus !== 'disconnected') return;

    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, options
    });
    // eslint-disable-next-line
  }, [roomStatus]);

  return roomStatus === 'disconnected' ? null : children || null;
});
AutoJoin.whyDidYouRender = false;

export default AutoJoin;
