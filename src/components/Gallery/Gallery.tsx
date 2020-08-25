import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Participant from './Participant/Participant';
import { Participant as IParticipant } from 'twilio-video';
import { getBoxSize } from '../../utils/galleryBoxes';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { range, sortBy } from 'lodash';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { not, propsEqual } from '../../utils/functional';

// both with and without shift key; first half of this string will be used for the labels
const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

const PALETTE = ['#EFE2F4', '#D2D3F3', '#E1DAF4', '#C4CBF2'];
const paletteColor = (i: number) => PALETTE[i % PALETTE.length];

// truncate an array, or pad it with undefined, to set its length to n
const arrayOfLength = (n: number) => (xs: any[]) => range(0, n).map((i) => xs[i]);

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100vh',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

export default function Gallery() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const [focusGroup, setFocusGroup] = useState<IParticipant[]>([]);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [forceGallery, setForceGallery] = useState<boolean>(false);
  const [showHotKeys, setShowHotKeys] = useState<boolean>(false);

  console.log('sids', participants.map((p) => p.sid));

  const toggleSelectedParticipant = useCallback((participant: IParticipant) => {
    return setFocusGroup(focusGroup.find(propsEqual('sid')(participant))
      ? focusGroup.filter(not(propsEqual('sid')(participant)))
      : [...focusGroup, participant]);
  }, [setFocusGroup, focusGroup])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(true);
      if (e.key === 'Control') setShowHotKeys(true);
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(false);
      if (e.key === 'Control') setShowHotKeys(false);
      if (e.key === '0' || e.key === ')') setFocusGroup([]);
      const idx = KEYS.indexOf(e.key) % (KEYS.length / 2); // KEYS includes shifted KEYS, so % length / 2
      if (participants[idx]) toggleSelectedParticipant(participants[idx]);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [toggleSelectedParticipant, participants]);

  const containerRef = (node: HTMLElement | null) => setContainer(node);
  const containerSize = { width: container?.clientWidth || 0, height: container?.clientHeight || 0 };

  const showingGallery = (focusGroup.length === 0 || forceGallery);
  const boxes = showingGallery ? arrayOfLength(30)(participants) : focusGroup;
  const boxSize = getBoxSize(containerSize, 16/9, boxes.length);
  const selectedIndex = (p: IParticipant) => focusGroup.findIndex(propsEqual('sid')(p)) + 1;

  return (
    <Container ref={containerRef}>
      { boxes.map((participant, i) => (
        participant
          ? (
            <Participant
              key={participant.sid}
              participant={participant}
              onClick={() => toggleSelectedParticipant(participant)}
              selectedIndex={forceGallery ? selectedIndex(participant): 0}
              hotKey={showingGallery || showHotKeys ? KEYS[i] : undefined}
              width={boxSize.width}
              height={boxSize.height}
              color={'pink'}
            />
          )
          : (
            <div style={{ ...boxSize, backgroundColor: paletteColor(i) }} />
          )
        )
      ) }
    </Container>
  );
}
