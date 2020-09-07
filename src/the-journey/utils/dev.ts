import { isEqual as isEqual } from 'lodash';

const prevValues: Record<string, any> = {};

const jsonEqual = (a: any, b: any) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return 'error'
  }
}

interface ReportEqualArgs { name: string, value: any }

export function reportEqual(data: Record<string, any>, withJson?: boolean) {
  const prefix = data.prefix || '';
  for (const name in data) if (name !== 'prefix') {
    const key = prefix + name;
    const value = data[name];
    const prev = prevValues[key];
    console.log(name, ':',
      prev === value ? '===' : '!==', ',',
      prev == value ? '==' : '!=', ',',
      isEqual(prev, value) ? 'isEqual' : '!isEqual',
      'jsonEqual:', jsonEqual(prev, value)
    );
    if (withJson) {
      console.log(JSON.stringify(prev));
      console.log(JSON.stringify(value));
    }
    prevValues[key] = value;
  }
  console.log('---');
}

export function prevIfEqual(name: string, value: any) {
  const prev = prevValues[name];
  if (isEqual(prev, value)) return prev;
  prevValues[name] = value;
  return value;
}
