import { range, isEqual } from 'lodash';

type BooleanFn = (...args: any[]) => boolean;

export const noop = () => {};
export const not = (f: BooleanFn) => (...args: any[]) => !f(...args);

export const and: (...fs: BooleanFn[]) => BooleanFn =
  (...fs: BooleanFn[]) => (...args: any[]) =>
    fs.length > 0 ? fs[0](...args) && and(...fs.slice(1))(...args) : true;

export const propsEqual = (prop: string) => (a: Record<string, any>) =>
  (b: Record<string, any>) => isEqual(a[prop], b[prop]);

// truncate an array, or pad it with undefined, to set its length to n
export const arrayFixedLength = (n: number) => (xs: any[]) =>
  range(0, n).map((i) => xs[i]);

// add or remove an element from an array, depending on whether it's there or not
export const toggleMembership = (xs: any[]) => (x: any) =>
  xs.includes(x) ? xs.filter(xx => xx !== x) : [...xs, x];

export const constrain = (a: number, b: number) => (n: number) => Math.max(a, Math.min(b, n));

export const unixTime = () => Math.floor(Date.now() / 1000);

// allows negative indexing
export const element = (i: number) => (xs: any[]) => xs[i < 0 ? xs.length + i : i];

export const toggle = (prevValue: any, newValue: any) => isEqual(prevValue, newValue) ? undefined : newValue;

export const tryToParse = (json: string) => {
  try { return JSON.parse(json) }
  catch (e) { console.log('Error parsing JSON', e) }
}

export const pick = (keys: string[], obj: Record<string, any>) => {
  let result: Record<string, any> = {};
  keys.forEach((key) => {
    if (obj.key !== undefined) result[key] = obj[key];
  });
  return result;
}
