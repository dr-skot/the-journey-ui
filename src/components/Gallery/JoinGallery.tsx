import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

let count = 0;

export default function MenuBar() {
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();
  const [tryingToJoin, setTryingToJoin] = useState(false);

  const roomName = 'room';

  useEffect(() => {
    if (roomState === 'disconnected' && !isConnecting && !isFetching && !isAcquiringLocalTracks && !tryingToJoin) {
      console.log('join gallery', count++, { roomState, isConnecting, isFetching, isAcquiringLocalTracks, user });
      setTryingToJoin(true);
      getToken('admin-user', roomName).then(token => connect(token)).then(() => setTryingToJoin(false));
    }
  }, [roomState, isConnecting, isFetching, isAcquiringLocalTracks, user, tryingToJoin, connect, getToken]);

  return null;
}
