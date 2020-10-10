import React from 'react';
import { render } from '@testing-library/react';
import FOHControls from './FOHControls';

describe('the Exclude button', () => {
  const mockParticipant = {
    identity: 'dude|audience|1',
    on: () => {},
    off: () => {},
  };

  it('exists among the controls', () => {
    // @ts-ignore
    const { getByText } = render(<FOHControls participant={mockParticipant}/>);
    expect(getByText('exclude')).toBeDefined();
  })
})
