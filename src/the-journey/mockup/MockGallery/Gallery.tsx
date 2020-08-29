import React, { useCallback, useEffect, useState } from 'react';
import { range } from 'lodash';
import { styled } from '@material-ui/core/styles';
import Nobody from '../Nobody/Nobody';
import { getBoxSize } from '../../utils/galleryBoxes';
import { not, propsEqual } from '../../utils/functional';

export interface Participant {
  sid: number,
  color: string,
  identity: string,
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

const names = ['Swedish Chef', 'Fozzie', 'Miss Piggy', 'Gonzo', 'Doctor Teeth', 'Floyd', 'Kermit', 'Animal',
  'Walter', 'Janice', 'Pepé', 'Rowlf', 'Bunsen & Beaker', 'Scooter', 'Joe from Legal', 'Turquoise', 'Bird',
  'B & E', 'sick in bed', 'Cookie', 'The Count', 'Grover', '???', 'Lin', 'anonymous', 'O Trafficker',
  'Caroling Chickens', 'Meryl Sheep', 'Yoda', 'Darth'];

const participants: Participant[] = range(0, 30).map((idx) => ({
  sid: idx, color: getRandomColor(), identity: names[idx]
}));
const KEYS = 'QWERTYUIOPASDFGHJKL:ZXCVBNM<>?qwertyuiopasdfghjkl;zxcvbnm,./';

const Container = styled('div')(({ theme }) => ({
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
  const [showHotKeys, setShowHotKeys] = useState<boolean>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const toggleSelectedParticipant = useCallback((participant: Participant) => {
    return setSelectedParticipants(selectedParticipants.find(propsEqual('sid')(participant))
      ? selectedParticipants.filter(not(propsEqual('sid')(participant)))
      : [...selectedParticipants, participant]);
  }, [selectedParticipants, setSelectedParticipants])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(true);
      if (e.key === 'Control') setShowHotKeys(true);
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(false);
      if (e.key === 'Control') setShowHotKeys(false);
      if (e.key === '0' || e.key === ')') setSelectedParticipants([]);
      const idx = KEYS.indexOf(e.key) % (KEYS.length / 2); // KEYS includes shifted KEYS, so % 2
      if (participants[idx]) toggleSelectedParticipant(participants[idx]);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [toggleSelectedParticipant]);

  const containerRef = (node: HTMLElement | null) => setContainer(node);
  const containerSize = container ? elementClientSize(container) : { width: 0, height: 0 };

  const showingGallery = (selectedParticipants.length === 0 || forceGallery);
  const boxes = showingGallery ? participants : selectedParticipants;
  const boxSize = getBoxSize(containerSize, 16/9, boxes.length);

  return (
    <Container ref={containerRef}>
        { boxes.map((participant) => (
          <Nobody
            key={participant.sid}
            participant={participant}
            onClick={() => toggleSelectedParticipant(participant)}
            selectedIndex={forceGallery ? selectedParticipants.findIndex(propsEqual('sid')(participant)) + 1: 0}
            showHotKey={showingGallery || showHotKeys}
            width={boxSize.width}
            height={boxSize.height}
            img={twoDigit(participant.sid + 1)}
          />
        )) }
      </Container>
    );
}
