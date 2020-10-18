import React from 'react';
import AutoJoin from '../../components/AutoJoin';
import UnstaffedRoomCheck from '../../components/UnstaffedRoomCheck';
import WithFacts from '../Facts/WithFacts';
import Broadcast from '../Broadcast/Broadcast';
import { useLocalTracks } from '../../hooks/useLocalTracks';

export default function Lurk() {
  useLocalTracks();
  return <>
    <AutoJoin role="lurker"/>
    <UnstaffedRoomCheck>
      <WithFacts><Broadcast/></WithFacts>
    </UnstaffedRoomCheck>
  </>;
}
