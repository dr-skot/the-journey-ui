import React, { useState } from 'react';
import useWindowSize from '../../utils/useWindowSize';
import { arrayFixedLength } from '../../utils/functional';
import { getBoxSize } from '../../utils/galleryBoxes';
import { Participant as IParticipant } from 'twilio-video';
import Participant from './components/Participant/Participant';
import Nobody from './components/Nobody';
import { listKey } from '../../utils/react-help';
import { ASPECT_RATIO } from './FixedGallery';
import { styled } from '@material-ui/core/styles';

const Container = styled('div')(() => ({
  position: 'relative', /* TODO why? */
  height: '100vh', /* TODO use useHeight */
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

interface FlexibleGalleryProps {
  participants: IParticipant[];
  selection?: string[];
  fixedLength?: number;
  hotKeys?: string;
  mute?: boolean;
  onClick?: (participant: IParticipant) => void;
}

export default function FlexibleGallery({
                           participants, fixedLength, selection = [], hotKeys, mute = true, onClick = () => {}
                         }: FlexibleGalleryProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [windowWidth, windowHeight] = useWindowSize();

  const containerRef = (node: HTMLElement | null) => setContainer(node);

  // TODO this conditional is just to force rerender on resize; is there a better way?
  const containerSize = (windowWidth && windowHeight)
    ? { width: container?.clientWidth || 0, height: container?.clientHeight || 0 }
    : { width: 0, height: 0 };

  const boxes = fixedLength ? arrayFixedLength(fixedLength)(participants) : participants;
  const boxSize = getBoxSize(containerSize, ASPECT_RATIO, boxes.length);
  const selectedIndex = (p: IParticipant) => selection ? selection.indexOf(p.identity) + 1 : 0;

  return (
    <Container ref={containerRef}>
      { boxes.map((participant, i) => (
          participant
            ? (
              <Participant
                key={participant.sid}
                participant={participant}
                selectedIndex={selectedIndex(participant)}
                hotKey={hotKeys && hotKeys[i]}
                width={boxSize.width}
                height={boxSize.height}
                mute={mute}
                onClick={() => onClick(participant)}
              />
            )
            : <Nobody key={listKey('nobody', i)} index={i} width={boxSize.width} height={boxSize.height} />
        )
      ) }
    </Container>
  );
}