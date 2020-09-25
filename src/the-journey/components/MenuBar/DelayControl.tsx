import React, { useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import { useSharedRoomState } from '../../contexts/AppStateContext';

const valence = (x: number) => (x < 0 ? -1 : 1);

export default function DelayControl() {
  const [{ delayTime }, roomStateDispatch] = useSharedRoomState();

  const bumpDelayTime = useCallback((bump: number) => {
    roomStateDispatch('set', { delayTime: delayTime + bump });
  }, [delayTime, roomStateDispatch])

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const bumpIndex = ['_-|=+'].indexOf(e.key) - 2 || -100;
      if (bumpIndex < -2) return;
      const bump = 1 / (10 ^ Math.abs(bumpIndex)) * valence(bumpIndex);
      bumpDelayTime(bump);
    }
    document.addEventListener('keydown', handleKeys);
    return () => document.removeEventListener('keydown', handleKeys);
  }, [bumpDelayTime])

  return (
  <>
    delay
    <IconButton aria-label="decrease delay" onClick={() => bumpDelayTime(-0.1)}>
      <MinusIcon />
    </IconButton>
      {delayTime ? delayTime.toFixed(2) : 0}
    <IconButton aria-label="increase delay" onClick={() => bumpDelayTime(0.1)}>
       <PlusIcon />
    </IconButton>
  </>
  );
}
