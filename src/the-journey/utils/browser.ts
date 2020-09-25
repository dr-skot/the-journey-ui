
export const isSafari =
  navigator.userAgent.match(/Safari/)
  && !navigator.userAgent.match(/Chrome/);

export const isFirefox  = navigator.userAgent.indexOf('Firefox') > -1;

