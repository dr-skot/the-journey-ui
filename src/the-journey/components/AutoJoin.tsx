import React, { useContext, useEffect, useState } from 'react';
import { useRouteMatch, match } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { defaultRoom, SettingsAdjust, UserRole } from '../utils/twilio';

interface AutoJoinProps {
  roomName?: string,
  username?: string,
  role?: UserRole,
  withAudio?: boolean,
  options?: SettingsAdjust,
  children?: any,
}

const AutoJoin = React.memo(({ roomName, username, role = 'lurker', withAudio, options,
                                   children }: AutoJoinProps) => {
  const [{ roomStatus, localTracks }, dispatch] = useContext(AppContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  // get audio tracks if withAudio
  useEffect(() => {
    if (roomStatus === 'disconnected' && withAudio)
      dispatch('getLocalTracks', { audioOnly: true })
  }, [roomStatus, withAudio]);

  useEffect(() => {
    if (roomStatus !== 'disconnected' || (withAudio && localTracks.length === 0)) return;

    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, options
    });

  }, [roomStatus, withAudio, localTracks.length, dispatch, roomNameReally]);

  return roomStatus === 'disconnected' ? null : children || null;
});
AutoJoin.whyDidYouRender = false;

export default AutoJoin;
