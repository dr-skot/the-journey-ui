import { useContext, useEffect, useState } from 'react';
import { isDev } from '../utils/react-help';
import { AppContext } from '../contexts/AppContext';
import { unixTime } from '../utils/functional';

export default function AutoJoin() {
  const [, dispatch] = useContext(AppContext);
  const [identity, setIdentity] = useState('');

  // TODO where should these live?
  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'gallery'

  useEffect(() => { setIdentity(`backstage-${unixTime()}`) }, []);

  useEffect(() => {
    if (identity) dispatch('joinRoom', { roomName, identity, subscribeProfile });
  }, [roomName, identity, subscribeProfile, dispatch]);

  return null;
}
