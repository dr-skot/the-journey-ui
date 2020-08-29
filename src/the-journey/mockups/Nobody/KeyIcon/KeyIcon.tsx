import React from 'react';
import { styled } from '@material-ui/core/styles';

interface KeyIconProps {
  keyName: string,
}

const OuterKey = styled('div')(() => ({
  width: '3em',
  height: '3em',
  borderRadius: '0.5em',
  backgroundColor: 'lightgray',
  padding: '0.4em',
}));

const InnerKey = styled('div')(() => ({
  width: '2em',
  height: '2em',
  borderRadius: '0.25em',
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center',
  paddingTop: '0.3em',
  userSelect: 'none',
}));

export default function KeyIcon({ keyName }: KeyIconProps) {
  return (
    <OuterKey>
      <InnerKey>
        {keyName}
      </InnerKey>
    </OuterKey>
  );
}
