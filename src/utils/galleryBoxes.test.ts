import { getBoxSize } from './galleryBoxes';

describe('getBoxSize', () => {
  it('returns nonzero size when theres only one box', () => {
    const size = getBoxSize({ width: 985, height: 623 }, 16/9, 1);
    expect(size).not.toEqual({ width: 0, height: 0 });
  })
})
