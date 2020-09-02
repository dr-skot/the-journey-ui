import { range, isEqual } from 'lodash';

export const noop = () => {};
export const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args);

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
