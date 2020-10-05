import React from 'react';
import { Button } from '@material-ui/core';

export default function MenuButton(label: string, onClick: () => void) {
  return <Button
    onClick={onClick}
    style={{ margin: '0.5em' }}
    size="small" color="default" variant="contained">
    {label}
  </Button>
}
