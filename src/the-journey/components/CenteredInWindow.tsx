import { styled } from '@material-ui/core';
import React, { ReactNode } from 'react';

const Floater = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
});

const Floated = styled('div')({
  position: 'relative',
  top: '-50%',
  left: '-50%',
});

interface CenteredInWindowProps {
  children: ReactNode,
}
export default function CenteredInWindow({ children }: CenteredInWindowProps) {
  return <Floater><Floated>{ children }</Floated></Floater>;
}
