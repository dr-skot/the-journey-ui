import React, { useEffect, useState } from 'react';
import { Button, styled } from '@material-ui/core';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import useHeight from '../../hooks/useHeight/useHeight';
import fscreen from 'fscreen';

export default function Millicast() {
  console.log('hey');
  return (
    <Button onClick={() => { alert('clicked') }}>Click me</Button>
  )
}
