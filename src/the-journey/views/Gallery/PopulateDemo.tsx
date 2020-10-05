import React, { FunctionComponent, useEffect, useState } from 'react';
import { arrayFixedLength } from '../../utils/functional';
import { getBoxSize } from '../../utils/galleryBoxes';
import Nobody from './components/Nobody';
import { ASPECT_RATIO } from './FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import Muppet from './components/Muppet';
import CenteredInWindow from '../../components/CenteredInWindow';
import { Button } from '@material-ui/core';
import { listKey } from '../../utils/react-help';

const ORDERS = [
  [  1,  3,  5,  2,  4,  6,
     7,  9, 11,  8, 10, 12,
    13, 15, 17, 14, 16, 18,
    19, 21, 23, 20, 22, 24,
    25, 27, 29, 26, 28, 30 ],

  [ 25, 23, 17, 18, 24, 26,
    11,  7,  1,  2,  8, 12,
    13,  9,  3,  4, 10, 14,
    21, 15,  5,  6, 16, 22,
    29, 27, 19, 20, 28, 30 ],

  [ 25, 23, 11, 12, 24, 26,
    13,  7,  1,  2,  8, 14,
    17,  9,  3,  4, 10, 18,
    21, 19,  5,  6, 20, 22,
    29, 27, 15, 16, 28, 30 ],

  [ 25, 23,  7,  8, 24, 26,
    15,  9,  1,  2, 10, 16,
    17, 11,  3,  4, 12, 18,
    21, 19,  5,  6, 20, 22,
    29, 27, 13, 14, 28, 30 ],

  [ 25, 23,  7,  8, 24, 26,
    15, 11,  1,  2, 12, 16,
    17, 13,  3,  4, 14, 18,
    21, 19,  5,  6, 20, 22,
    29, 27,  9, 10, 28, 30 ],
];

const Container = styled('div')(() => ({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
}));

export default function PopulateDemo() {
  const [muppets, setMuppets] = useState<boolean[]>([]);
  const [order, setOrder] = useState(0);

  return <>
    <Gallery size={30} order={ORDERS[order]} content={muppets} contentComponent={MuppetBox} blankComponent={BlankBox}/>
    <CenteredInWindow>
      <div style={{ textAlign: 'center' }}>
        <Button style={{ margin: 2 }} variant="contained" onClick={() => setMuppets([]) }>
          clear
        </Button>
      <div>
        <Button style={{ margin: 2 }} variant="contained" onClick={() => setMuppets([ ...muppets, true ])}>
          +
        </Button>
        <Button style={{ margin: 2 }} variant="contained" onClick={() => setMuppets(muppets.slice(0, -1))}>
          -
        </Button>
      </div>
      <Button style={{ margin: 2 }} variant="contained" onClick={() => setOrder((order + 1) % ORDERS.length) }>
        order {order + 1}
      </Button>
      </div>
    </CenteredInWindow>
    </>
}


const MuppetBox: BoxComponent = ({ width, height, index }) => (
  <Muppet key={listKey('muppet', index)} width={width} height={height} index={index} number={index + 1}/>
)

const BlankBox: BoxComponent = ({ width, height, index }) => (
  <Nobody key={listKey('nobody', index)} width={width} height={height} index={index}/>
)

interface BoxProps { width: number, height: number, index: number, content?: any };
type BoxComponent = FunctionComponent<BoxProps>

interface GalleryProps {
  size: number,
  content: any[],
  contentComponent: BoxComponent,
  blankComponent: BoxComponent,
  order: number[],
}

function Gallery({ size, content, contentComponent, blankComponent, order }: GalleryProps) {
  const [container, setContainer] = useState<HTMLElement | null>();
  const containerRef = (node: HTMLElement | null) => setContainer(node)
  const [, rerender] = useState(false);

  // rerender on resize
  useEffect(() => {
    const forceRender = () => rerender((prev) => !prev);
    window.addEventListener('resize', forceRender);
    window.addEventListener('fullscreenchange', forceRender);
    return () => {
      window.removeEventListener('resize', forceRender);
      window.removeEventListener('fullscreenchange', forceRender);
    }
  }, [])

  const containerSize = { width: container?.clientWidth || 0, height: container?.clientHeight || 0 };

  let boxes = arrayFixedLength(size)(content);
  console.log('boxes', boxes.length)
  const { width, height } = getBoxSize(containerSize, ASPECT_RATIO, boxes.length);

  return (
    <Container ref={containerRef}>
      { order.map((n) => {
        const index = n - 1;
        const boxContent = boxes[index];
        return (boxContent ? contentComponent : blankComponent)({ width, height, index, content: boxContent })
      } ) }
    </Container>
  );
}
