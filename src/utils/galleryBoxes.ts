import { range } from 'lodash';

export interface size {
  width: number,
  height: number,
}

export function boxSize(screen: size, boxRatio: number, rows: number, columns: number): size {
  const scale = Math.min(screen.height / rows, screen.width / (columns * boxRatio));
  return { width: scale * boxRatio, height: scale };
}

// brute-force
export function boxesPerRow(screen: size, boxRatio: number, numBoxes: number): number {
  return range(1, numBoxes + 1).reduce((acc, columns) => {
    const rows = Math.ceil(numBoxes / columns);
    const size = boxSize(screen, boxRatio, rows, columns);
    return (size.width > acc.width) ? { columns, ...size } : acc;
  }, { columns: 0, width: 0 }).columns;
}

export function getBoxSize(containerSize: size, boxRatio: number, numBoxes: number) {
  if (containerSize.width === 0 || containerSize.height === 0) return { width: 0, height: 0 };
  const columns = boxesPerRow(containerSize, boxRatio, numBoxes);
  const rows = Math.ceil(numBoxes / columns);
  return boxSize(containerSize, boxRatio, rows, columns);
}

export function getBoxSizeInContainer(container: HTMLDivElement | null, boxRatio: number, numBoxes: number) {
  if (!container) return null;
  return getBoxSize({ width: container.clientWidth, height: container.clientHeight }, boxRatio, numBoxes);
}

