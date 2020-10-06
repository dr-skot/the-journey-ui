import { columnSplit } from './usePagedAudience';

describe('columnSplit', () => {
  it('splits an array into columns', () => {
    const array =
      [  1,  2,  3,  4,  5,  6,
         7,  8,  9, 10, 11, 12 ];
    expect(columnSplit(6, 1, array)).toEqual([1,2,3,7,8,9]);
    expect(columnSplit(6, 2, array)).toEqual([4,5,6,10,11,12]);
  })
});
