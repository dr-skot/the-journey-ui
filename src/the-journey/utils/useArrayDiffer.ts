import { useCallback, useState } from 'react';
import { difference } from 'lodash';

export default function useArrayDiffer() {
  const [, setPreviousValue] = useState([]);
  /*
  const diff = useCallback((newValue) => {
    let result = { added: [], removed: [] };
    setPreviousValue((previousValue) => {
      const added = difference(newValue, previousValue);
      const removed = difference(previousValue, newValue);
      result = { added, removed };
      return added.length || removed.length ? newValue : previousValue;
    })
    return result;
  }, [setPreviousValue]);

  return diff;
   */
}
