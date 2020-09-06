import React, { useEffect, useState } from 'react';
import { getBoxSize } from '../../utils/galleryBoxes';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantVideoWindow from '../../components/Participant/ParticipantVideoWindow';
import { ASPECT_RATIO } from './FixedGallery';
import { styled } from '@material-ui/core/styles';
import Nobody from './components/Nobody';
import { arrayFixedLength } from '../../utils/functional';

const Container = styled('div')(() => ({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

interface FlexibleGalleryProps {
  participants: IParticipant[];
  selection?: string[];
  fixedLength?: number;
  hotKeys?: string;
  // Typescript's being weird about MouseEvent, but that's what e is
  onClick?: (e: any, participant: IParticipant) => void;
}

export default function FlexibleGallery({ participants, fixedLength = 0, selection = [],
                                          hotKeys = '', onClick = () => {}
                         }: FlexibleGalleryProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const containerRef = (node: HTMLElement | null) => setContainer(node);

  // rerender on resize
  useEffect(() => {
    const forceRender = () => setContainer(null);
    window.addEventListener('resize', forceRender);
    return () => window.removeEventListener('resize', forceRender);
  })

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
          onClick={(e) => onClick(e, participant)}
        />
        ) : <Nobody width={boxSize.width} height={boxSize.height} index={i}/>
      )) }
    </Container>
  );
}
