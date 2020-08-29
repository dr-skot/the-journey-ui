import { useCallback, useState } from 'react';
import { difference } from 'lodash';

export default function useArrayDiffer(initialValue: any[]) {
  const [previousValue, setpreviousValue] = useState(initialValue);

  const diff = useCallback((newValue) => {
    const added = difference(newValue, previousValue);
    const removed = difference(previousValue, newValue);
    setpreviousValue(newValue);
    return { added, removed };
  }, [previousValue]);

  return diff;
}
