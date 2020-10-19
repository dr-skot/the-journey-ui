import { newStickyMap, newStickySet } from './stickySet';

describe('stickySet', () => {
  it('initializes with an empty set', () => {
    const stickySet = newStickySet();
    expect(stickySet.getSet()).toEqual([]);
  });
  it('can be initialized with a set', () => {
    const stickySet = newStickySet([1, 3, 2]);
    expect(stickySet.getSet().sort()).toEqual([1, 2, 3]);
  });
  it('retains elements that have only recently disappeared', () => {
    const stickySet = newStickySet([1, 3, 2]);
    stickySet.update([1, 3]);
    expect(stickySet.getSet().sort()).toEqual([1, 2, 3]);
  });
  it('loses elements after an expiration time', (done) => {
    const stickySet = newStickySet([1, 3, 2], 200);
    stickySet.update([1, 3]);
    expect(stickySet.getSet().sort()).toEqual([1, 2, 3]);
    setTimeout(() => {
      expect(stickySet.getSet().sort()).toEqual([1, 3]);
      done();
    }, 300);
  });
})

describe('stickyMap', () => {
  it('initializes with empty values', () => {
    const stickyMap = newStickyMap();
    expect(stickyMap.getValues()).toEqual([]);
  });
  it('can be initialized with pairs', () => {
    const stickyMap = newStickyMap([['1', { id: 1 }], ['3', { id: 3 }], ['2', { id: 2 }]]);
    expect(stickyMap.getValues()).toEqual([{ id: 1 }, { id: 3 }, { id: 2 }]);
  });
  it('retains elements that have only recently disappeared', () => {
    const stickyMap = newStickyMap([['1', { id: 1 }], ['3', { id: 3 }], ['2', { id: 2 }]]);
    stickyMap.update([['1', { id: 1 }], ['3', { id: 3 }]]);
    expect(stickyMap.getValues()).toEqual([{ id: 1 }, { id: 3 }, { id: 2 }]);
  });
  it('loses elements after an expiration time', (done) => {
    const stickyMap = newStickyMap([['1', { id: 1 }], ['3', { id: 3 }], ['2', { id: 2 }]], 200);
    stickyMap.update([['1', { id: 1 }], ['3', { id: 3 }]]);
    expect(stickyMap.getValues()).toEqual([{ id: 1 }, { id: 3 }, { id: 2 }]);
    setTimeout(() => {
      expect(stickyMap.getValues()).toEqual([{ id: 1 }, { id: 3 }]);
      done();
    }, 300);
  });
})
