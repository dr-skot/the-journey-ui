const DEFAULT_INTERVAL = 5000;
const DEFAULT_MAX_COUNT = 5;

export function fetchWithDelayReport(url: string, options: RequestInit,
                                     interval = DEFAULT_INTERVAL,
                                     maxCount = DEFAULT_MAX_COUNT) {
  let count = 0;
  const timeoutId = setInterval(() => {
    count += 1;
    console.log(`fetch ${url} no answer after ${count * interval}ms`);
    if (count >= maxCount) clearInterval(timeoutId)
  }, interval);

  console.log(`fetching ${url}`);
  const fetchTime = Date.now();
  return fetch(url, options)
    .then((result) => {
      console.log(`fetched in ${Date.now() - fetchTime} ms: ${url}`);
      return result;
    })
    .catch((error) => {
      console.log(`error fetching ${url}:`, error);
      throw error;
    })
    .finally(() => {
      clearInterval(timeoutId);
    });
}
