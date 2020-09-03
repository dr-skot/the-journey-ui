import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function Rejected() {
  const [{ room  }] = useContext(AppContext);
  room?.disconnect();
  return <h1>Sorry, you've been disconnected.</h1>;
}
