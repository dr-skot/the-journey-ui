import React from 'react';
import AutoJoin from '../../components/AutoJoin';
import WithFacts from '../Facts/WithFacts';
import Broadcast from '../Broadcast/Broadcast';
import RoomCheck from './RoomCheck';

export default function Lurk() {
  return <>
    <AutoJoin role="lurker"/>
    <RoomCheck>
      <WithFacts><Broadcast/></WithFacts>
    </RoomCheck>
  </>;
}
