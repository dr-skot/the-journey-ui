import React from 'react';
import Participant from '../../../components/Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const Container = styled('aside')(({ theme }) => ({
  padding: '0.5em',
  overflowY: 'auto',
  [theme.breakpoints.down('xs')]: {
    overflowY: 'initial',
    overflowX: 'auto',
    padding: 0,
    display: 'flex',
  },
}));

const ScrollContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
  },
}));

export default function SidebarSelfie() {
  const { room: { localParticipant } } = useVideoContext();

  return (
    <Container>
      <ScrollContainer>
        { /* TODO make these attributes optional */ }
        <Participant participant={localParticipant} onClick={() => {}} isSelected={false} disableAudio={true} />
      </ScrollContainer>
    </Container>
  );
}
