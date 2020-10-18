import React, { useEffect } from 'react';
import AutoJoin from '../../components/AutoJoin';
import UnstaffedRoomCheck from '../../components/UnstaffedRoomCheck';
import WithFacts from '../Facts/WithFacts';
import Broadcast from '../Broadcast/Broadcast';
import Video from 'twilio-video';

// This one works in iOS Safari because it gets permission to use the microphone
// which confers permission to play newly created audio elements

export default function Lurk2() {
  useEffect(() => {
    Video.createLocalAudioTrack();
  }, []);
  return <>
    <AutoJoin role="lurker"/>
    <UnstaffedRoomCheck>
      <WithFacts><Broadcast/></WithFacts>
    </UnstaffedRoomCheck>
  </>;
}
