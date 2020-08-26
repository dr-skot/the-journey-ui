import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Participant from './Participant/Participant';
import { Participant as IParticipant } from 'twilio-video';
import { getBoxSize } from '../../utils/galleryBoxes';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { range } from 'lodash';
// import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { not, propsEqual } from '../../utils/functional';
import { listKey } from '../../utils/react-help';

// both with and without shift key; first half of this string will be used for the labels
const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

const PALETTE = ['#EFE2F4', '#D2D3F3', '#E1DAF4', '#C4CBF2'];
const paletteColor = (i: number) => PALETTE[i % PALETTE.length];

// truncate an array, or pad it with undefined, to set its length to n
const arrayOfLength = (n: number) => (xs: any[]) => range(0, n).map((i) => xs[i]);

const Container = styled('div')(() => ({
  position: 'relative', /* TODO what does this do? */
  height: '100vh', /* TODO use useHeight */
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

const Nobody = styled('div')(() => ({
  width: '100%',
  height: '100%',
  border: '0.5px solid black',
}));

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function Gallery() {
  // const { room } = useVideoContext();
  const participants = useParticipants();
  const [focusGroup, setFocusGroup] = useState<IParticipant[]>([]);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [forceGallery, setForceGallery] = useState<boolean>(false);
  const [showHotKeys, setShowHotKeys] = useState<boolean>(false);
  const [windowWidth, windowHeight] = useWindowSize();

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
  // TODO this conditional is just to force rerender on resize; find a better way
  const containerSize = (windowWidth && windowHeight)
    ? { width: container?.clientWidth || 0, height: container?.clientHeight || 0 }
    : { width: 0, height: 0 };
  console.log({ containerSize });

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
              color={'pink'} /* TODO get rid of color */
              mute={showingGallery}
            />
          )
          : (
            <div key={listKey('nobody', i)} style={{ ...boxSize, backgroundColor: paletteColor(i) }}>
              <Nobody />
            </div>
          )
        )
      ) }
    </Container>
  );
}
