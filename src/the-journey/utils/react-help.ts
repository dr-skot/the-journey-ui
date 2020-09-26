import { isEqual } from 'lodash';

// get around the indexes-as-keys complaint, when it really is okay to do so
export const listKey = (...args: any[]) => args.join('-');

export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


//
// cache-if-equal service, to prevent triggering rerender with equal-valued objects
//

const cache: Record<string, any> = {};

// TODO I can't figure out how to type this so typescript knows cached('key')(test)(thing: T) result will be T
export function cached<T>(key: string) {
  return ({
    // TODO should logically be (incumbent: T, challenger: T) but that makes typescript complain if T is an array
    if: (test: (incumbent: any, challenger: any) => boolean) => (value: T) => {
      if (cache.hasOwnProperty(key)) {
        const prev = cache[key] as T;
        if (test(prev, value)) return prev;
      }
      cache[key] = value;
      return value;
    },
    ifEqual: (value: T) => cached(key).if(isEqual)(value) as T,
  });
}
