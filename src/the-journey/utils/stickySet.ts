import { compact } from 'lodash';

export function newStickySet<T>(initialSet: T[] = [], expirationTime = 1000) {
  const expiryStarts = new Map<T, number | null>();
  initialSet.forEach((item) => expiryStarts.set(item, null));
  const stickySet = {
    update: (updatedSet: T[]) => {
      const now = Date.now();
      // first mark them all to expire
      expiryStarts.forEach((when, item) => {
        if (!when) expiryStarts.set(item, now);
      });
      // then cancel expiry on the updated ones
      updatedSet.forEach((item) => expiryStarts.set(item, null));
      return stickySet;
    },
    getSet: () => {
      const now = Date.now();
      // expire old ones
      expiryStarts.forEach((when, key) => {
        if (when && now - when > expirationTime) expiryStarts.delete(key);
      });
      return Array.from(expiryStarts.keys());
    },
  }
  return stickySet;
}

export function newStickyMap<T>(initialPairs: [string, T][] = [], expirationTime = 1000) {
  const getKeys = (pairs: [string, T][]) => pairs.map((pair) => pair[0]);
  const map = new Map(initialPairs);
  const stickySet = newStickySet(getKeys(initialPairs), expirationTime);
  const stickyMap = {
    update: (updatedPairs: [string, T][]) => {
      updatedPairs.forEach(([key, value]) => map.set(key, value));
      const keys = stickySet.update(getKeys(updatedPairs)).getSet();
      map.forEach((value, key) => {
        if (!keys.includes(key)) map.delete(key);
      })
      return stickyMap;
    },
    getValues: () => compact(stickySet.getSet().map((key) => map.get(key))),
  }
  return stickyMap;
}
