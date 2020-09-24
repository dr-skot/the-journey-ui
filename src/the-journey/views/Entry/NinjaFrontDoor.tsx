import React from 'react';
import Entry from './NewEntry';
import { defaultRoom } from '../../utils/twilio';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

export default function NinjaFrontDoor() {
  const match = useRouteMatch() as match<{ code?: string }>;
  const roomName = match.params.code || defaultRoom();
  return <Entry roomName={roomName} />
}

