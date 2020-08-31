import { constrain } from './functional';

describe('constrain', () => {
  it('returns x if its in range', () => {
    expect(constrain(1,6)(5)).toBe(5);
  })
});
