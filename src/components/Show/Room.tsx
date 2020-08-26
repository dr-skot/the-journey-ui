import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';
import useRemoteDataTracks from './useRemoteDataTrack';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';

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
  console.log('render Room')
  const participants = useParticipants();
  const [focusGroup, setFocusGroup] = useState<string[]>([]);

  console.log('participants', participants.length);
  console.log('focus group', focusGroup);

  useRemoteDataTracks((data) => {
    setFocusGroup(JSON.parse(data))
  });


  return (
    <Container>
      <Floater>
        <SidebarSelfie />
        { participants.map((participant) => (
          <ParticipantTracks participant={participant} disableVideo={true} disableAudio={!focusGroup.includes(participant.sid)} />
        )) }
      </Floater>
      <Main>
        <iframe width="100%" height="100%" src="https://viewer.millicast.com/v1?streamId=[ACCOUNT_ID]/[STREAM_NAME]" />
      </Main>
    </Container>
  );
}
