import { isEqual, isFunction } from 'lodash';
import { useState } from 'react';

// get around the indexes-as-keys complaint, when it really is okay to do so
export const listKey = (...args: any[]) => args.join('-');

// or use an incrementing counter
let UNIQ_KEY_VALUE = 1;
export const uniqKey = () => `uniq-key-${UNIQ_KEY_VALUE++}`;

export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// useful for sensible state updating (note parameter order:
// new value first because so we can pass the curried function to setState)
export const ifChanged = (newValue: any) => (oldValue: any) =>
  isEqual(oldValue, newValue) ? oldValue : newValue;

export function useSmartState(initialValue: any) {
  const [state, setState] = useState(initialValue);
  const [prevResult, setPrevResult] = useState<any[]>([]);

  function smartSetState(arg: any) {
    let result;
    setState((prevState: any) => {
      const newState = isFunction(arg) ? arg(prevState) : arg;
      result = isEqual(newState, prevState) ? prevState : newState;
      return result;
    });
    return result;
  }

  const result = [state, smartSetState];
  if (isEqual(prevResult, result)) return prevResult;
  setPrevResult(result);
  return result;
}

const prevIfEqual_values: Record<string, any> = {};

export function prevIfEqual(name: string, value: any) {
  const prev = prevIfEqual_values[name];
  if (isEqual(prev, value)) return prev;
  prevIfEqual_values[name] = value;
  return value;
}



//
//
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
    ifEqual: (value: T) => cached(key).if(isEqual)(value),
  });
}
