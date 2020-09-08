import React, { useCallback, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MinusIcon from '@material-ui/icons/RemoveCircle';
import PlusIcon from '@material-ui/icons/AddCircle';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';

export default function GainControl() {
  const [{ gain }, changeSharedState] = useContext(SharedRoomContext);

  const bumpGain = useCallback((bump: number) => {
    // @ts-ignore
    changeSharedState({ gain: gain + bump });
  }, [gain, changeSharedState])

  return (
  <>
    gain
    <IconButton aria-label="decrease delay" onClick={() => bumpGain(-0.05)}>
      <MinusIcon />
    </IconButton>
      {gain ? gain.toFixed(2) : 0}
    <IconButton aria-label="increase delay" onClick={() => bumpGain(0.05)}>
       <PlusIcon />
    </IconButton>
  </>
  );
}
