import { styled } from '@material-ui/core';
import React, { ReactNode } from 'react';

const Floater = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

interface CenteredInWindowProps {
  children: ReactNode,
}
export default function CenteredInWindow({ children }: CenteredInWindowProps) {
  return <Floater>{ children }</Floater>;
}
