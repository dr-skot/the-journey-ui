import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ExcludeButton from './ExcludeButton';
import WS from 'jest-websocket-mock';
import { initWebSocketServer } from '../../../../../../room-state-manager';
import AppStateContextProvider from '../../../../contexts/AppStateContext';
import { renderWithRouterMatch } from '../../../../utils/react-testing';

const wsServer = new WS('ws://localhost:8081');
initWebSocketServer(wsServer);

describe('the Exclude button', () => {
  const mockParticipant = {
    identity: 'dude|audience|1',
  };

  it('says hide', () => {
    // @ts-ignore
    const { getByRole } = render(<ExcludeButton participant={mockParticipant}/>);
    expect(getByRole('button').textContent).toBe('hide');
  });

    it('adds participant to the excluded list', (done) => {
    const TestComponent = () => (
      // @ts-ignore
      <AppStateContextProvider><ExcludeButton participant={mockParticipant}/></AppStateContextProvider>
    );

    const { getByRole } = renderWithRouterMatch(TestComponent);
    fireEvent.click(getByRole('button'));
    setTimeout(() => {
      expect(getByRole('button').textContent).toBe('hidden!');
      done();
    }, 1000);
  });

});

