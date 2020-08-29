import React, { useCallback, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { useAppState } from '../../../state';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import { renderIntoDocument } from 'react-dom/test-utils';
import useLocalDataTrack from './useLocalDataTrack';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function DelayControl() {
  const { audioDelay, setAudioDelay } = useAppState()
  const localDataTrack = useLocalDataTrack();

  const bumpDelay = useCallback((n: number) => {
      setAudioDelay(Math.max(0, audioDelay + n))
      console.log('sending delay', audioDelay + n);
      localDataTrack.send(JSON.stringify({ audioDelay: audioDelay + n }));
    }, [audioDelay, setAudioDelay, localDataTrack]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (['+', '='].includes(e.key)) bumpDelay(1);
      if (['-', '_'].includes(e.key)) bumpDelay(-1);
    }
    document.addEventListener('keydown', handleKeys);
    return () => document.removeEventListener('keydown', handleKeys);
  }, [bumpDelay])

  return (
  <>
    <IconButton aria-label="decrease delay" onClick={() => bumpDelay(-1)}>
      <MinusIcon />
    </IconButton>
      {audioDelay}
    <IconButton aria-label="increase delay" onClick={() => bumpDelay(1)}>
       <PlusIcon />
    </IconButton>
  </>
  );
}
