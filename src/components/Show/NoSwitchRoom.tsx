import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';
import { isDev } from '../../utils/react-help';
import useAudioSubscribeWatcher from '../../hooks/useAudioSubscriber/useAudioElementSubscribeWatcher';
import useDataTrackListener from '../../state/useDataTrackListener';
import useFocusGroupSubscriber from '../../state/useFocusGroupSubscriber';

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

export default function Room() {
  console.log('render noswitch Room')
  useFocusGroupSubscriber();
  useAudioSubscribeWatcher();

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
