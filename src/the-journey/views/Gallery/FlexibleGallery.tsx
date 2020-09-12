import React, { useEffect, useState } from 'react';
import { getBoxSize } from '../../utils/galleryBoxes';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantVideoWindow from '../../components/Participant/ParticipantVideoWindow';
import { ASPECT_RATIO } from './FixedGallery';
import { styled } from '@material-ui/core/styles';
import Nobody from './components/Nobody';
import { arrayFixedLength } from '../../utils/functional';
import { listKey } from '../../utils/react-help';
import ResizeObserver from 'resize-observer-polyfill';

const Container = styled('div')(() => ({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

export interface FlexibleGalleryProps {
  participants: IParticipant[];
  selection?: string[];
  fixedLength?: number;
  hotKeys?: string;
  onClick?: (participant: IParticipant, e: MouseEvent) => void;
  blanks?: 'black' | undefined,
}

export default function FlexibleGallery({ participants, fixedLength = 0, selection = [],
                                          hotKeys = '', onClick = () => {}, blanks
                         }: FlexibleGalleryProps) {
  const [container, setContainer] = useState<HTMLElement | null>();
  const containerRef = (node: HTMLElement | null) => setContainer(node)
  const [, rerender] = useState(false);
  const [resizeObserver] = useState(new ResizeObserver(() => {
    console.log('resize observer');
    rerender((prev) => !prev);
  }));

  console.log('flexible gallery render');

  // rerender on resize
  useEffect(() => {
    const forceRender = () => rerender((prev) => !prev);
    window.addEventListener('resize', forceRender);
    return () => window.removeEventListener('resize', forceRender);
  }, [])

  useEffect(() => {
    if (!container) return;
    resizeObserver.observe(container);
    return () => resizeObserver.unobserve(container);
  }, [container])

  // console.log('FlexibleGallery render', { participants, fixedLength, selection, hotKeys, onClick, container });
  // reportEqual({ prefix: 'FlexibleGallery', participants, fixedLength, selection, hotKeys, onClick, container });

  const containerSize = { width: container?.clientWidth || 0, height: container?.clientHeight || 0 };

  const boxes = fixedLength ? arrayFixedLength(fixedLength)(participants) : participants;
  const boxSize = getBoxSize(containerSize, ASPECT_RATIO, boxes.length);
  const selectedIndex = (p: IParticipant) => selection ? selection.indexOf(p.identity) + 1 : 0;

  return (
    <Container ref={containerRef}>
      { boxes.map((participant, i) => (
        participant ? (
        <ParticipantVideoWindow
          key={participant.sid}
          participant={participant}
          selectedIndex={selectedIndex(participant)}
          hotKey={hotKeys && hotKeys[i]}
          width={boxSize.width}
          height={boxSize.height}
          onClick={(e) => onClick(participant, e as unknown as MouseEvent)}
        />
        ) : <Nobody width={boxSize.width} height={boxSize.height} index={i}
                    key={listKey('nobody', i)} blanks={blanks} />
      )) }
    </Container>
  );
}
