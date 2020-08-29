
// get around react's complaint about using indexes as keys, when it really is okay to do so
export const listKey = (...args: any[]) => args.join('-');

let UNIQ_KEY_VALUE = 1;
export const uniqKey = () => `uniq-key-${UNIQ_KEY_VALUE++}`;

export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
