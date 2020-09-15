import React, { ReactNode, useState } from 'react';
import { Button, styled } from '@material-ui/core';
import useFullScreenToggle from '../../../twilio/hooks/useFullScreenToggle/useFullScreenToggle';
import Facts from './Facts';

const Floater = styled('div')({
  position: 'absolute',
  top: 10,
  left: '25%',
  zIndex: 10000000000000,
});

const Floated = styled('div')({
  position: 'relative',
  left: '-50%',
});


interface WithFactsProps {
  children: ReactNode,
}

export default function WithFacts({ children }: WithFactsProps) {
  const [justFacts, setJustFacts] = useState(false);
  const [isFullScreen] = useFullScreenToggle();

  return (
    <>
      { justFacts ? <Facts/> : children }
      { !isFullScreen && <Floater><Floated>
        <Button onClick={() => setJustFacts((prev) => !prev)} variant="contained" color="primary">
          {justFacts ? 'view' : 'facts'}
        </Button>
      </Floated></Floater> }
    </>
  );
}
