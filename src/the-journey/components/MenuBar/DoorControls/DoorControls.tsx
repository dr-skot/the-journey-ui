import useShowtime from '../../../hooks/useShowtime/useShowtime';
import CloseDoorsButton from './CloseDoorsButton';
import React from 'react';
import { formatTime } from '../../../utils/foh';
import { serverNow } from '../../../utils/ServerDate';
import DoorsOpenControl from './DoorsOpenControl';

export default function DoorControls() {
  const { curtain } = useShowtime() || {};

  const showtime = curtain ? formatTime(curtain) : undefined;
  const now = serverNow();

  return <>
    { showtime && <div style={{textAlign: 'center', marginRight: '2em' }}>
      { /* put SHOWTIME in its own span so tests can find it with getByText */ }
        <span>SHOWTIME</span><br/>
        {showtime.time} {showtime.day}
      </div> }
    { curtain && (now < curtain ? <DoorsOpenControl/> : <CloseDoorsButton/>) }
  </>
}

