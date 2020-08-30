import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Participant from './components/Participant/Participant';
import { Participant as IParticipant } from 'twilio-video';
import { getBoxSize } from '../../utils/galleryBoxes';
import { listKey } from '../../utils/react-help';
import useWindowSize from '../../utils/useWindowSize';
import Nobody from './components/Nobody';
import useOperatorControls from './hooks/useOperatorControls';
import useGalleryParticipants from './hooks/useGalleryParticipants';
import useFocusGroupVideoSubscriber from '../../hooks/useFocusGroupSubscriber/useFocusGroupVideoSubscriber';
import useTrackSubscriber from '../../hooks/useTrackSubscriber';
import { arrayFixedLength } from '../../utils/functional';

const GALLERY_SIZE = 30;
const ASPECT_RATIO = 16/9;

const Container = styled('div')(() => ({
  position: 'relative', /* TODO why? */
  height: '100vh', /* TODO use useHeight */
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

export function Operator() {
  const { participants, focusGroup, focusing, hotKeys, toggleFocus } = useOperatorControls();

  // TODO move this elsewhere and provide fallback alternatives
  useFocusGroupVideoSubscriber();

  return (
    <FlexibleGallery
      participants={participants}
      selection={focusGroup}
      fixedLength={focusing ? undefined : GALLERY_SIZE}
      hotKeys={hotKeys}
      mute={focusGroup.length > 0}
      onClick={toggleFocus}
    />
  );
}

export function FixedGallery() {
  const participants = useGalleryParticipants();

  // TODO move this elsewhere and provide fallback alternatives
  const subscribe = useTrackSubscriber();
  subscribe(undefined, undefined, 'gallery');

  return <FlexibleGallery participants={participants} fixedLength={GALLERY_SIZE}/>
}

interface GalleryProps {
  participants: IParticipant[];
  selection?: string[];
  fixedLength?: number;
  hotKeys?: string;
  mute?: boolean;
  onClick?: (participant: IParticipant) => void;
}

function FlexibleGallery({
  participants, fixedLength, selection = [], hotKeys, mute = true, onClick = () => {}
}: GalleryProps) {
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
