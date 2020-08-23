import React, { useEffect } from 'react';
import { range } from 'lodash';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useSelectedParticipants from '../VideoProvider/useSelectedParticipants/useSelectedParticipants';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr`,
  gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr',
  gridGap: '2px',
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
    gridGap: '6px',
  },
}));

const Nobody = styled('div')(() => ({
  backgroundColor: 'red',
}));

export default function Gallery() {
  const participants = useParticipants();
  const [selectedParticipants, toggleSelectedParticipant] = useSelectedParticipants();

  useEffect(() => {
    console.log('doing it');
    let row: string | null = null;
    let column: string | null = null;
    const selectKeyListener = (e: KeyboardEvent) => {
      console.log('keyup at all');
      if ('abcdeABCDE'.includes(e.key)) column = e.key.toUpperCase();
      if ('123456'.includes(e.key)) row = e.key;
      if (column && row) {
        const idx = '123456'.indexOf(row) * 5 + 'ABCDE'.indexOf(column);
        console.log(`toggling participant ${idx}: ${participants[idx]?.sid}`);
        if (participants[idx]) toggleSelectedParticipant(participants[idx]);
        row = null;
        column = null;
      }
      console.log('key listener', { column, row });
    }
    document.addEventListener('keyup', selectKeyListener);
    return () => document.removeEventListener('keyup', selectKeyListener);
  }, [toggleSelectedParticipant]);

  return (
    <Container>
      { range(0, 30).map((i) => (
        participants[i] ? (
          <Participant
            key={participants[i].sid}
            participant={participants[i]}
            isSelected={selectedParticipants.includes(participants[i])}
            onClick={() => toggleSelectedParticipant(participants[i])}
          />
        ) : (
          <Nobody />
        )
      )) }
    </Container>
  );
}
