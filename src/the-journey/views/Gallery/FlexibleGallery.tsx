import React, { useState } from 'react';
import { getBoxSize } from '../../utils/galleryBoxes';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantVideoWindow from '../../components/Participant/ParticipantVideoWindow';
import { styled } from '@material-ui/core/styles';
import Nobody, { Blanks } from './components/Nobody';
import { arrayFixedLength } from '../../utils/functional';
import { listKey } from '../../utils/react-help';
import useRerenderOnResize from '../../hooks/useRerenderOnResize';
import { range } from 'lodash';

export const GALLERY_SIZE = 30;
export const ASPECT_RATIO = 16/9;

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
  blanks?: Blanks,
  muteControls?: boolean,
  order?: number[],
}

export default function FlexibleGallery({ participants, fixedLength = 0, selection = [], hotKeys = '',
                                          onClick = () => {}, blanks, muteControls, order
                                        }: FlexibleGalleryProps) {
  useRerenderOnResize();
  const [container, setContainer] = useState<HTMLElement | null>();
  const containerRef = (node: HTMLElement | null) => setContainer(node)

  const containerSize = { width: container?.clientWidth || 0, height: container?.clientHeight || 0 };

  let boxOrder = order || range(1, 31);
  boxOrder = fixedLength ? arrayFixedLength(fixedLength)(boxOrder) : boxOrder;
  const boxSize = getBoxSize(containerSize, ASPECT_RATIO, boxOrder.length);
  const selectedIndex = (p: IParticipant) => selection ? selection.indexOf(p.identity) + 1 : 0;

  return (
    <Container ref={containerRef}>
      { boxOrder.map((n) => {
        const i = n - 1;
        const participant = participants[i];
        return participant ? (
          <ParticipantVideoWindow
            key={participant.sid} 
            participant={participant}
            selectedIndex={selectedIndex(participant)}
            hotKey={hotKeys && hotKeys[i]}
            width={boxSize.width}
            height={boxSize.height}
            onClick={(e) => onClick(participant, e as unknown as MouseEvent)}
            mutable={muteControls}
          />
        ) : <Nobody width={boxSize.width} height={boxSize.height} index={i}
                    key={listKey('nobody', i)} blanks={blanks}/>
      }) }
    </Container>
  );
}
