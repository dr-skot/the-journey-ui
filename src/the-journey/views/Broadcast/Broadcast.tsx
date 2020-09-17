import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import { AppContext } from '../../contexts/AppContext';
import Millicast from './Millicast2';
import FocusGroup from '../Gallery/FocusGroup';
import Stage from './Stage';
import Controls from '../../components/Controls/Controls';
import { getIdentities, inGroup, isRole } from '../../utils/twilio';
import ParticipantVideoWindow from '../../components/Participant/ParticipantVideoWindow';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';

const SIGN_LANGUAGE_WINDOW_SIZE = {
  width: 16 * 20,
  height: 9 * 20,
}

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100%',
}));

const Main = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}));

const Column = styled('div')(() => ({
  flex: '1 1 0',
}));

const SignLanguageWindow = styled('div')(() => ({
  position: 'absolute',
  bottom: 70,
  right: 10,
  width: SIGN_LANGUAGE_WINDOW_SIZE.width,
}));



export type BroadcastType = 'millicast' | 'hybrid' | 'pure'
interface BroadcastProps {
  type?: BroadcastType,
}

export default function Broadcast({ type }: BroadcastProps) {
  const [{ room }] = useContext(AppContext);
  const [{ focusGroup }] = useContext(SharedRoomContext);
  const [split, setSplit] = useState(false);
  const participants = useParticipants('includeMe');
  const signInterpreter = participants.find(isRole('sign-interpreter'));
  console.log('sign-interpreter', { signInterpreter });

  // TODO guarantee no ghosts in focusGroup at the source
  const existant = getIdentities(participants);
  const noGhosts = focusGroup.filter((identity) => existant.includes(identity));

  const newSplit = (type === 'pure' || type === 'hybrid') && noGhosts.length > 0;
  const width = newSplit ? '50%' : '100%';

  if (newSplit !== split) setSplit(newSplit);

  // trigger onResize listeners when split changes
  useEffect(() => {
    var ev = new CustomEvent('resize'); //instantiate the resize event
    ev.initEvent('resize');
    window.dispatchEvent(ev); // fire 'resize' event!
  }, [split]);

  // change video priority when entering and leaving the focus group
  useEffect(() => {
    if (!room) return;
    const me = room.localParticipant;
    const priority = inGroup(focusGroup)(me) ? 'high' : 'low';
    const videoTrackPub = me.videoTracks.values().next()?.value;
    if (!videoTrackPub) return;
    if (videoTrackPub.priority !== priority) {
      console.log('changing my video priority to', priority);
      videoTrackPub.setPriority(priority);
    }
  }, [focusGroup, room]);

  return (
    <Container>
      <SubscribeToFocusGroupAudio/>
      <FocusGroupAudio/>
      <Main>
        { split && <Column style={{ width }}><FocusGroup/></Column> }
        <Column style={{ width }}>
          { /* TODO find an elegant alternative to these forced rerenders */}
          { type === 'pure' ? <Stage/> : <Millicast/> }
        </Column>
      </Main>
      {signInterpreter && <SignLanguageWindow><ParticipantVideoWindow participant={signInterpreter} { ...SIGN_LANGUAGE_WINDOW_SIZE } /></SignLanguageWindow>}
      {isRole('audience')(room?.localParticipant) && <Controls />}
    </Container>
  );
}
