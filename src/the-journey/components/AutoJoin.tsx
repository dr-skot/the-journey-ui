import React, { useContext, useEffect, useState } from 'react';
import { isDev } from '../utils/react-help';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../contexts/AppContext';

export default function AutoJoin() {
  const [, dispatch] = useContext(AppContext);
  const [identity, setIdentity] = useState('');

  // TODO where should these live?
  const roomName = isDev() ? 'dev-room2' : 'room2';
  const subscribeProfile = 'gallery'

  // TODO joiner adds uniqId to all names (could be timestamp instead of uuid)
  // TODO use backstage instead of gallery for prefix
  useEffect(() => { setIdentity(`gallery-${uuidv4()}`) }, []);

  useEffect(() => {
    if (identity) dispatch('joinRoom', { roomName, identity, subscribeProfile });
  }, [roomName, identity, subscribeProfile, dispatch]);

  return null;
}
