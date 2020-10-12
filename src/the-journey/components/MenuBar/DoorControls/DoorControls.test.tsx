import React from 'react';
import { render } from '@testing-library/react';
import useCode from '../../../hooks/useCode';
import DoorControls from './DoorControls';
import { DEFAULT_DOOR_POLICY } from '../../../utils/foh';
import { timeToCodeWithTZ } from '../../../utils/codes';
import { DateTime } from 'luxon';
import { useAppState } from '../../../contexts/AppStateContext';

jest.mock('../../../contexts/AppStateContext');
const mockUseAppState = useAppState as jest.Mock;

jest.mock('../../../hooks/useCode');
const mockUseCode = useCode as jest.Mock;

describe("the DoorControls component", () => {
  beforeEach(() => {
    mockUseAppState.mockImplementation(() => [{ doorsOpen: 30, doorsClosed: 'undefined' }]);
  });
  it('shows no showtime if the codes not valid', () => {
    mockUseCode.mockImplementation(() => undefined);
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('SHOWTIME')).toThrow();
  });
  it('shows a showtime for a valid code', () => {
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(new Date()));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('SHOWTIME')).not.toThrow();
  });
  it('shows a doors open control before showtime', () => {
    const showtime = DateTime.local().plus({ minutes: 1 }).toJSDate();
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(showtime));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('doors open')).not.toThrow();
  });
  it('doesnt snow a doors open control after showtime', () => {
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(new Date()));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('doors open')).toThrow();
  });
  it('doesnt show a CLOSE DOOR button before showtime', () => {
    const showtime = DateTime.local().plus({ minutes: 1 }).toJSDate();
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(showtime));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('Close Doors')).toThrow();
  });
  it('doesnt show a CLOSE DOOR button after showtime', () => {
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(new Date()));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('Close Doors')).not.toThrow();
  });
  it('doesnt show a CLOSE DOOR button after doors close', () => {
    const showtime = DateTime.local().minus({ minutes: DEFAULT_DOOR_POLICY.close }).toJSDate();
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(showtime));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('Close Doors')).toThrow();
  });
  it('shows a OPEN DOOR button if doors have been explicitly closed', () => {
    const showtime = DateTime.local().minus({ minutes: 30 }).toJSDate();
    mockUseAppState.mockImplementation(() => [{
      doorsOpen: 30,
      doorsClosed: DateTime.local().minus({ minutes: 10 }).toJSON(),
    }]);
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(showtime));
    const { getByText } = render(<DoorControls/>);
    expect(() => getByText('Open Doors')).not.toThrow();
  });
})
