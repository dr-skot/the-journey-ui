import React, { FunctionComponent, ReactComponentElement, ReactNode, useEffect, useState } from 'react';
import { arrayFixedLength } from '../../utils/functional';
import { getBoxSize } from '../../utils/galleryBoxes';
import Nobody from './components/Nobody';
import { ASPECT_RATIO } from './FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import Muppet from './components/Muppet';
import CenteredInWindow from '../../components/CenteredInWindow';
import { Button } from '@material-ui/core';
import { listKey } from '../../utils/react-help';

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

  return <>
    <Gallery size={30} content={muppets} contentComponent={MuppetBox} blankComponent={BlankBox}/>
    <CenteredInWindow>
      <Button variant="contained" onClick={() => setMuppets([ ...muppets, true ])}>
        +
      </Button>
      <Button variant="contained" onClick={() => setMuppets(muppets.slice(0, -1))}>
        -
      </Button>
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
}

function Gallery({ size, content, contentComponent, blankComponent }: GalleryProps) {
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

  const boxes = arrayFixedLength(size)(content);
  console.log('boxes', boxes.length)
  const { width, height } = getBoxSize(containerSize, ASPECT_RATIO, boxes.length);

  const order = [8, 9, 14, 15, 20, 21, 7, 10, 13, 16, 6, 11, 12, 17, 19, 22,
    2, 3, 26, 27, 18, 23, 1, 4, 0, 5, 25, 28, 24, 29];

  return (
    <Container ref={containerRef}>
      { boxes.map((_, slot) => {
        const index = order.indexOf(slot);
        const boxContent = boxes[index];
        return (boxContent ? contentComponent : blankComponent)({ width, height, index, content: boxContent })
      } ) }
    </Container>
  );
}

function populateGrid(size: number, content: any[]) {
  if (size !== 30) return arrayFixedLength(size)(content);
  const grid = arrayFixedLength(size)([]);
  const order = [8, 9, 14, 15, 20, 21, 7, 10, 13, 16, 6, 11, 12, 17, 19, 22,
    2, 3, 26, 27, 1, 4, 0, 5, 18, 23, 25, 28, 24, 29];
  content.forEach((item, i) => { grid[order[i]] = content });
  return grid;
}
