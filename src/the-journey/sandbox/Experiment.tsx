import React, { useContext } from 'react';
import AppContextProvider, { AppContext } from '../contexts/AppContext';
import { joinRoom } from '../utils/twilio';

function doIt() {
  joinRoom('aRoom', 'aPerson')
    .then(room => console.log('got room', room))
    .catch(error => console.log('got error', error));
}
function Tester() {
  // @ts-ignore
  const [state, dispatch] = useContext(AppContext)
  return (
    <>
    <h3>Test</h3>
      <button onClick={() => dispatch('joinRoom', { roomName: 'aRoom', identity: `aPerson-${Math.random()}` })}>joinRoom</button>
      <button onClick={() => doIt()}>doIt</button>
      <p>{ state.roomStatus }</p>
      </>
  );
}

export default function Experiment() {
  return (
    <AppContextProvider>
      <Tester />
    </AppContextProvider>
  )
}
