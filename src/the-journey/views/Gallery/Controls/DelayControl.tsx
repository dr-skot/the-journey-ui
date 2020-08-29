import React, { useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import useLocalDataTrack from '../../../hooks/useLocalDataTrack';
import useJourneyAppState from '../../../hooks/useJourneyAppState';

const valence = (x: number) => (x < 0 ? -1 : 1);

export default function DelayControl() {
  const { audioDelay, setAudioDelay } = useJourneyAppState();
  const localDataTrack = useLocalDataTrack();

  const bumpDelay = useCallback((n: number) => {
      setAudioDelay(Math.max(0, audioDelay + n)) // TODO switch to useState and do this with callback
      console.log('sending delay', audioDelay + n);
      localDataTrack.send(JSON.stringify({ audioDelay: audioDelay + n }));
    }, [audioDelay, setAudioDelay, localDataTrack]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const bumpIndex = ['_-|=+'].indexOf(e.key) - 2 || -100;
      if (bumpIndex < -2) return;
      const bumpAmount = 1 / (10 ^ Math.abs(bumpIndex)) * valence(bumpIndex);
      bumpDelay(bumpAmount);
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
