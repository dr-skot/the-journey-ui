import React, { useContext, useEffect } from 'react';
import { TwilioRoomContext } from '../contexts/TwilioRoomContext';
import { defaultRoom, SettingsAdjust, UserRole } from '../utils/twilio';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

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
  const [{ roomStatus, localTracks }, dispatch] = useContext(TwilioRoomContext);
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomNameReally = roomName || match.params.code || defaultRoom();

  // get audio tracks if withAudio
  useEffect(() => {
    if (roomStatus === 'disconnected' && withAudio)
      dispatch('getLocalTracks', { audioOnly: true })
  }, [roomStatus, withAudio, dispatch]);

  useEffect(() => {
    if (roomStatus !== 'disconnected' || (withAudio && localTracks.length === 0)) return;

    dispatch('joinRoom', {
      roomName: roomNameReally, role: role, username, options
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomStatus, withAudio, localTracks.length, dispatch, roomNameReally]);

  return roomStatus === 'disconnected' ? null : children || null;
});
AutoJoin.whyDidYouRender = false;

export default AutoJoin;
