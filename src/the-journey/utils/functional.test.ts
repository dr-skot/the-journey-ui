import { constrain, elements, findIndexes } from './functional';

describe('constrain', () => {
  it('returns x if its in range', () => {
    expect(constrain(1,6)(5)).toBe(5);
  })
});

describe('findIndexes', () => {
  it('finds indexes where a predicate is true', () => {
    const xs: string[] = ['bob', 'joe', 'fred', 'alice', 'odell', 'hobo', 'mark', 'marco'];
    expect(findIndexes((x: string) => !!x.match(/o/))(xs)).toEqual([0,1,4,5,7]);
  })
})

describe('elements', () => {
  it('returns the selected elements', () => {
    const xs: string[] = ['bob', 'joe', 'fred', 'alice', 'odell', 'hobo', 'mark', 'marco'];
    const indexesWithO = findIndexes((x: string) => !!x.match(/o/))(xs);
    expect(elements(indexesWithO)(xs)).toEqual(['bob', 'joe', 'odell', 'hobo', 'marco']);
  })
});
