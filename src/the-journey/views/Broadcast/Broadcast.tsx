import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SelfView from '../../components/Controls/SelfView';
import { AppContext } from '../../contexts/AppContext';
import Millicast from './Millicast3';
import FocusGroup from '../Gallery/FocusGroup';
import Stage from './Stage';
import Controls from '../../components/Controls/Controls';
import { getIdentities, isRole } from '../../utils/twilio';
import ParticipantVideoWindow from '../../components/Participant/ParticipantVideoWindow';
import FocusGroupAudio from '../../components/audio/FocusGroupAudio';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import SubscribeToFocusGroupAudio from '../../subscribers/SubscribeToFocusGroupAudio';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';

const SIGNER_WINDOW_SIZE = {
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

const SignerWindow = styled('div')(() => ({
  position: 'absolute',
  bottom: 70,
  right: 10,
  width: SIGNER_WINDOW_SIZE.width,
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
  const signer = participants.find(isRole('signer'));
  console.log('signer', { signer });

  // TODO guarantee no ghosts in focusGroup at the sour
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
      {signer && <SignerWindow><ParticipantVideoWindow participant={signer} { ...SIGNER_WINDOW_SIZE } /></SignerWindow>}
      {isRole('audience')(room?.localParticipant) && <Controls />}
    </Container>
  );
}
