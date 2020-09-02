import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SelfView from '../../components/Controls/SelfView';
import { AppContext } from '../../contexts/AppContext';
import LocalVideoPreview from './components/LocalVideoPreview';
import Millicast from './Millicast';
import FocusGroup from '../Gallery/FocusGroup';
import Stage from './Stage';
import Controls from '../../components/Controls/Controls';
import MenuBar from './components/MenuBar';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
}));

const Main = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}));

const Floater = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: theme.sidebarWidth,
}));

const Column = styled('div')(() => ({
  flex: '1 1 0',
}));

interface BroadcastProps {
  type?: 'millicast' | 'hybrid' | 'pure'
}

const AudienceMain = React.memo(({ type }: BroadcastProps) => {
  const [{ focusGroup }] = useContext(AppContext);
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


  return (
    <Container>
      <Main>
        { split && <Column style={{ width }}><FocusGroup/></Column> }
        <Column style={{ width }}>
          { /* TODO find an elegant alternative to these forced rerenders */}
          { type === 'pure' ? <Stage/> : <Millicast/> }
        </Column>
      </Main>
      <SelfView />
      <Controls />
    </Container>
  );
});

export default function Broadcast({ type }: BroadcastProps) {
  const [{ roomStatus }] = useContext(AppContext);
  return roomStatus === 'disconnected'
    ? <><MenuBar /><LocalVideoPreview /></>
    : <AudienceMain type={type} />;
}
