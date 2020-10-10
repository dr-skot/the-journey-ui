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

// TODO implement general functions with user-supplied predicate
// const includesBy => (pred) => (xs) => (x) => xs.some(pred);
// const toggleMembershipBy => (pred) => (xs) => (x) => includesBy(pred)(xs)(x) ? xs.filter(not(pred)) : [...xs, x];

export const includesEqual = (xs: any[]) => (x: any) => xs.some((xx) => isEqual(xx, x));

// add or remove an element from an array, depending on whether it's there or not
// uses isEqual for comparison
export const toggleMembership = (xs: any[]) => (x: any) => {
  return includesEqual(xs)(x) ? xs.filter(xx => !isEqual(xx, x)) : [...xs, x];
}

export const constrain = (a: number, b: number) => (n: number) => Math.max(a, Math.min(b, n));

export const unixTime = () => Math.floor(Date.now() / 1000);

// allows negative indexing
export const element = (i: number) => (xs: any[]) => xs[i < 0 ? xs.length + i : i];
export const elements = (indexes: number[]) => (xs: any[]) => indexes.map((i) => element(i)(xs));

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

export function findIndexes<T>(predicate: (x: T, i: number) => boolean) {
  return (xs: T[]) =>
    xs.map((x, i) => i).filter((i) => predicate(xs[i], i));
}


export function remove(xs: any[], x: any) {
  const i = xs.indexOf(x);
  if (i === -1) return;
  xs.splice(i, 1);
}

export const mod = (n: number, m: number) => ((n % m) + m) % m;
