import React from 'react';
import AutoJoin from '../../components/AutoJoin';
import UnstaffedRoomCheck from '../../components/UnstaffedRoomCheck';
import WithFacts from '../Facts/WithFacts';
import Broadcast from '../Broadcast/Broadcast';

export default function Lurk() {
  return <>
    <AutoJoin role="lurker"/>
    <UnstaffedRoomCheck>
      <WithFacts><Broadcast/></WithFacts>
    </UnstaffedRoomCheck>
  </>;
}
