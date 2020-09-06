import React from 'react';
import { styled } from '@material-ui/core/styles';

interface SelectionNumberProps {
  number: number,
}

const Circle = styled('div')(() => ({
  width: '2.5em',
  height: '2.5em',
  borderRadius: '100%',
  backgroundColor: 'yellow',
  border: '3px solid red',
  color: 'red',
  fontWeight: 'bold',
  textAlign: 'center',
  paddingTop: '0.3em',
  float: 'right',
  userSelect: 'none',
  marginTop: '0.5em',
}));

export default function SelectionNumber({ number }: SelectionNumberProps) {
  return (
    <Circle>
      {number}
    </Circle>
  );
}
