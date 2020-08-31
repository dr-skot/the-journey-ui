import React, { useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import { AppContext } from '../../../contexts/AppContext';

const valence = (x: number) => (x < 0 ? -1 : 1);

export default function DelayControl() {
  const [{ audioDelay }, dispatch] = useContext(AppContext);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const bumpIndex = ['_-|=+'].indexOf(e.key) - 2 || -100;
      if (bumpIndex < -2) return;
      const bump = 1 / (10 ^ Math.abs(bumpIndex)) * valence(bumpIndex);
      dispatch('bumpAudioDelay', { bump });
    }
    document.addEventListener('keydown', handleKeys);
    return () => document.removeEventListener('keydown', handleKeys);
  }, [dispatch])

  return (
  <>
    <IconButton aria-label="decrease delay" onClick={() => dispatch('bumpAudioDelay', { bump: -0.1 })}>
      <MinusIcon />
    </IconButton>
      {audioDelay ? audioDelay.toFixed(2) : 0}
    <IconButton aria-label="increase delay" onClick={() => dispatch('bumpAudioDelay', { bump: 0.1 })}>
       <PlusIcon />
    </IconButton>
  </>
  );
}
