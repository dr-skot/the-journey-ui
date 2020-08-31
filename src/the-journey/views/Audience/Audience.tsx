import React, { useContext } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './components/SidebarSelfie';
import { isDev } from '../../utils/react-help';
import { AppContext } from '../../contexts/AppContext';
import LocalVideoPreview from './components/LocalVideoPreview';
import MenuBar from './components/MenuBar';
import Controls from '../../../twilio/components/Controls/Controls';

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

function AudienceMain() {
  return (
    <Container>
      <Floater>
        <SidebarSelfie />
      </Floater>
      <Main>
        {!isDev() && (
            <iframe title="broadcast"
                src="https://viewer.millicast.com/v2?streamId=wbfwt8/ke434gcy"
                allowFullScreen width="100%" height="100%"
          />
        )}
      </Main>
    </Container>
  );
}

export default function Audience() {
  const [{ roomStatus }] = useContext(AppContext);

  return (
    <>
      <MenuBar/>
      { roomStatus === 'disconnected' ? <LocalVideoPreview/> : <AudienceMain/>}
    </>
  )
}
