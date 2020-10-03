import React, { useContext, useEffect } from 'react';
import { TwilioRoomContext } from '../contexts/TwilioRoomContext';
import { SettingsAdjust, UserRole } from '../utils/twilio';
import useRoomName from '../hooks/useRoomName';

interface AutoJoinProps {
  roomName?: string,
  username?: string,
  role?: UserRole,
  options?: SettingsAdjust,
  children?: any,
}

const AutoJoin = React.memo(({ roomName, username, role = 'lurker', options,
                                   children }: AutoJoinProps) => {
  const [{ roomStatus }, dispatch] = useContext(TwilioRoomContext);
  const roomNameReally = roomName || useRoomName();

  useEffect(() => {
    if (roomStatus !== 'disconnected') return;
    dispatch('joinRoom', { roomName: roomNameReally, role: role, username, options });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomStatus, dispatch, roomNameReally]);

  return roomStatus === 'disconnected' ? null : children || null;
});

export default AutoJoin;
