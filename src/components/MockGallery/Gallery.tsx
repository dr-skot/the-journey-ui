import React, { useEffect, useState } from 'react';
import { range } from 'lodash';
import { styled } from '@material-ui/core/styles';
import Nobody from '../Nobody/Nobody';

export interface Participant {
  sid: number,
  color: string,
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const participants: Participant[] = range(0, 30).map((idx) => ({ sid: idx, color: getRandomColor() }));
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234'

const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args);
// @ts-ignore
const propsEqual = (prop: string) => (a: object) => (b: object) => a[prop] === b[prop];

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr 1fr`,
  gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
  gridGap: '2px',
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
    gridGap: '6px',
  },
}));

export default function Gallery() {
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [forceGallery, setForceGallery] = useState<boolean>(false);

  const toggleSelectedParticipant = (participant: Participant) => {
    console.log('selectedParticipants', selectedParticipants.map((p) => p.sid));
    console.log('toggling', participant.sid);
    return setSelectedParticipants(selectedParticipants.find(propsEqual('sid')(participant))
      ? selectedParticipants.filter(not(propsEqual('sid')(participant)))
      : [...selectedParticipants, participant]);
  }

  useEffect(() => {
    let row: string | null = null;
    let column: string | null = null;
    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('keyup', e.key);
      if (e.key === 'Shift') setForceGallery(false);
      const idx = KEYS.indexOf(e.key.toUpperCase());
      if (participants[idx]) toggleSelectedParticipant(participants[idx]);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('keydown', e.key);
      if (e.key === 'Shift') setForceGallery(true);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [toggleSelectedParticipant]);

  return selectedParticipants.length === 0 || forceGallery
    ? (
      <Container>
        { participants.map((participant) => (
          <Nobody
            key={participant.sid}
            participant={participant}
            onClick={() => toggleSelectedParticipant(participant)}
            isSelected={!!selectedParticipants.find(propsEqual('sid')(participant))}
          />
        )) }
      </Container>
    ) : (
      <Container>
        { selectedParticipants.map((participant) => (
          <Nobody
            key={participant.sid}
            participant={participant}
            onClick={() => toggleSelectedParticipant(participant)}
            isSelected={!!selectedParticipants.find(propsEqual('sid')(participant))}
          />
        )) }
      </Container>
    );
}
