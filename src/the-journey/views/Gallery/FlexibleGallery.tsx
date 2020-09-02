import React, { useEffect, useState } from 'react';
import { getBoxSize } from '../../utils/galleryBoxes';
import { Participant as IParticipant } from 'twilio-video';
import Participant from './components/Participant/Participant';
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
  star?: string;
  selection?: string[];
  fixedLength?: number;
  hotKeys?: string;
  mute?: boolean;
  // TODO figure out what to put for e that will satisfy TypeScript
  onClick?: (e: any, participant: IParticipant) => void;
}

export default function FlexibleGallery({ participants, fixedLength = 0, star, selection = [],
                                          hotKeys = '', mute = true, onClick = () => {}
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
        <Participant
          key={participant.sid}
          participant={participant}
          selectedIndex={selectedIndex(participant)}
          hotKey={hotKeys && hotKeys[i]}
          width={boxSize.width}
          height={boxSize.height}
          mute={mute}
          onClick={(e) => onClick(e, participant)}
          star={participant.identity === star}
        />
        ) : <Nobody width={boxSize.width} height={boxSize.height} index={i}/>
      )) }
    </Container>
  );
}
