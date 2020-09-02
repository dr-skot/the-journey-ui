import React, { useContext } from 'react';
import Participant from '../../../../twilio/components/Participant/Participant';
import { styled } from '@material-ui/core/styles';
import { AppContext } from '../../../contexts/AppContext';

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

export default function SelfView() {
  const [{ room }] = useContext(AppContext);
  if (!room?.localParticipant) return null;

  return (
    <Container>
      <ScrollContainer>
        { /* TODO make these attributes optional */ }
        <Participant participant={room.localParticipant} onClick={() => {}} isSelected={false} disableAudio={true} />
      </ScrollContainer>
    </Container>
  );
}
