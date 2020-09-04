import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SelfView from '../../components/Controls/SelfView';
import { AppContext } from '../../contexts/AppContext';
import Millicast from './Millicast';
import FocusGroup from '../Gallery/FocusGroup';
import Stage from './Stage';
import Controls from '../../components/Controls/Controls';
import { getSigner, isRole } from '../../utils/twilio';
import Participant from '../Gallery/components/Participant/Participant';

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
  const [{ room, focusGroup }] = useContext(AppContext);
  const [split, setSplit] = useState(false);

  const newSplit = (type === 'pure' || type === 'hybrid') && focusGroup.length > 0;
  const width = newSplit ? '50%' : '100%';

  if (newSplit !== split) setSplit(newSplit);

  // trigger onResize listeners when split changes
  useEffect(() => {
    var ev = new CustomEvent('resize'); //instantiate the resize event
    ev.initEvent('resize');
    window.dispatchEvent(ev); // fire 'resize' event!
  }, [split]);

  const signer = getSigner(room);
  console.log('signer', { signer });

  return (
    <Container>
      <Main>
        { split && <Column style={{ width }}><FocusGroup/></Column> }
        <Column style={{ width }}>
          { /* TODO find an elegant alternative to these forced rerenders */}
          { type === 'pure' ? <Stage/> : <Millicast/> }
        </Column>
      </Main>
      {signer && <SignerWindow><Participant participant={signer} { ...SIGNER_WINDOW_SIZE } /></SignerWindow>}
      {isRole('audience')(room?.localParticipant) && <><SelfView /><Controls /></>}
    </Container>
  );
}
