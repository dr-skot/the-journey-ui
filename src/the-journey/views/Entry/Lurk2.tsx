import React, { useEffect } from 'react';
import AutoJoin from '../../components/AutoJoin';
import WithFacts from '../Facts/WithFacts';
import Broadcast from '../Broadcast/Broadcast';
import Video from 'twilio-video';
import RoomCheck from './RoomCheck';

// This one works in iOS Safari because it gets permission to use the microphone
// which confers permission to play newly created audio elements

export default function Lurk2() {
  useEffect(() => {
    Video.createLocalAudioTrack();
  }, []);
  return <>
    <AutoJoin role="lurker"/>
    <RoomCheck>
      <WithFacts><Broadcast/></WithFacts>
    </RoomCheck>
  </>;
}
