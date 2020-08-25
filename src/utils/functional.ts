
export const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args);
export const propsEqual = (prop: string) => (a: Record<string, any>) => (b: Record<string, any>) => a[prop] === b[prop];
