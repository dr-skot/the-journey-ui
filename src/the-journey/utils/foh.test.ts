import moment from 'moment';
import { random, range } from 'lodash';
import { codeToTime, codeToTimeWithTZ, timeToCode, timeToCodeWithTZ, timezones } from './foh';

const datesToTry = (n: number) =>
  range(0, n).map(_ => {
    const date = new Date();
    date.setFullYear(2020 + random(0, 10));
    date.setMonth(random(0, 11));
    date.setDate(random(1, 31));
    date.setHours(random(0, 23));
    date.setMinutes(random(0, 59));
    return date;
  });

describe('timeToCode', () => {
  it('converts time to lowercase string of < 7 letters', () => {
    datesToTry(20).forEach(d => {
      const code = timeToCode(d);
      console.log(code);
      expect(code.length).toBeLessThan(7);
      expect(code).toMatch(/^[a-z]+$/);
    });
  });
  it('decodes to same time you put in (to the minute)', () => {
    datesToTry(20).forEach(d => {
      const inTime = new Date();
      const code = timeToCode(inTime);
      const outTime = codeToTime(code);
      const format = (d: Date) => moment(d).format('YYYY MM DD h:mm');
      expect(format(outTime)).toEqual(format(inTime));
    });
  });
});

describe('timeToCodeWithTZ', () => {
  it('converts time + tz to lowercase string of < 9 letters', () => {
    datesToTry(20).forEach(d => {
      const code = timeToCodeWithTZ(d, random(0, timezones.length - 1));
      console.log(code);
      expect(code.length).toBeLessThan(9);
      expect(code).toMatch(/^[a-z]+$/);
    });
  });
  it('decodes to same time you put in (to the minute)', () => {
    datesToTry(20).forEach(d => {
      const inTime = new Date();
      const inTZ = random(0, timezones.length - 1);
      const code = timeToCodeWithTZ(inTime, inTZ);
      const [outTime, outTZ] = codeToTimeWithTZ(code);
      const format = (d: Date) => moment(d).format('YYYY MM DD h:mm');
      expect(format(outTime)).toEqual(format(inTime));
      expect(outTZ).toEqual(inTZ);
    });
  });
});

