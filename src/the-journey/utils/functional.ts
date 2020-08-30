import { range } from 'lodash';

export const noop = () => {};
export const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args);
export const propsEqual = (prop: string) => (a: Record<string, any>) => (b: Record<string, any>) => a[prop] === b[prop];

// truncate an array, or pad it with undefined, to set its length to n
export const arrayFixedLength = (n: number) => (xs: any[]) => range(0, n).map((i) => xs[i]);

