import React, { useContext } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './components/SidebarSelfie';
import { isDev } from '../../utils/react-help';
import { AppContext } from '../../contexts/AppContext';
import LocalVideoPreview from './components/LocalVideoPreview';
import MenuBar from './components/MenuBar';
import Millicast from './Millicast';
import FocusGroup from '../Gallery/FocusGroup';
import Stage from './Stage';
// import Controls from '../../../twilio/components/Controls/Controls';

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

const Floater = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: theme.sidebarWidth,
}));

const Column = styled('div')(() => ({
  flex: '1 1 0',
}));

interface BroadcastProps {
  style?: 'millicast' | 'hybrid' | 'pure'
}

const AudienceMain = React.memo(({ style }: BroadcastProps) => {
  const [{ focusGroup }] = useContext(AppContext);

  console.log('style', style);

  return (
    <Container>
      <Floater>
        <SidebarSelfie />
      </Floater>
      <Main>
        { !!style && !!focusGroup.length && <Column><FocusGroup/></Column> }
        <Column>
          { style === 'pure' ? <Stage/> : <Millicast/> }
        </Column>
      </Main>
    </Container>
  );
});

export default function Broadcast({ style }: BroadcastProps) {
  const [{ roomStatus }] = useContext(AppContext);

  return (
    <>
      <MenuBar/>
      { roomStatus === 'disconnected' ? <LocalVideoPreview/> : <AudienceMain style={style} />}
    </>
  )
}
