import React, { useEffect, useRef, useState } from 'react';
import { range } from 'lodash';
import { styled } from '@material-ui/core/styles';
import Nobody from '../Nobody/Nobody';
import { getBoxSize, getBoxSizeInContainer, size } from '../../utils/galleryBoxes';

// ugh there must be a better way


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

function elementClientSize(el: HTMLElement) {
  return { width: el.clientWidth, height: el.clientHeight };
}

const twoDigit = (n: number) => `${n < 10 ? '0' : ''}${n}`;

const imgForParticipant = (n: number) => '';

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
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
    gridGap: '6px',
  },
}));

const EnlargedContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

export default function Gallery() {
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [forceGallery, setForceGallery] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<size>({ width: 0, height: 0 });

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

  // update container size when element changes
  useEffect(() => {
    if (containerRef.current) setContainerSize(elementClientSize(containerRef.current));
  }, [containerRef.current])

  console.log('change', selectedParticipants.length, containerRef.current);
  const boxes = (selectedParticipants.length === 0 || forceGallery ? participants : selectedParticipants);
  const boxSize = getBoxSize(containerSize, 16/9, boxes.length);

  console.log('containerRef.current', containerRef.current);  return (
    <EnlargedContainer ref={containerRef}>
        { boxes.map((participant) => (
          <Nobody
            key={participant.sid}
            participant={participant}
            onClick={() => toggleSelectedParticipant(participant)}
            isSelected={!!selectedParticipants.find(propsEqual('sid')(participant))}
            width={boxSize.width}
            height={boxSize.height}
            img={twoDigit(participant.sid + 1)}
          />
        )) }
      </EnlargedContainer>
    );
}
