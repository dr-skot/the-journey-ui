import { renderHook } from '@testing-library/react-hooks';
import useShowtime from './useShowtime';
import useCode from '../useCode';
import { useAppState } from '../../contexts/AppStateContext';
import { DEFAULT_DOOR_POLICY } from '../../utils/foh';
import { localTimezoneIndex, timeToCodeWithTZ } from '../../utils/codes';
import { DateTime } from 'luxon';

jest.mock('../useCode');
const mockUseCode = useCode as jest.Mock;

jest.mock('../../contexts/AppStateContext');
const mockUseAppState = useAppState as jest.Mock;

describe('useShowtime', () => {
  let curtain = new Date();

  beforeEach(() => {
    curtain = new Date('2020-01-01T20:00:00');
    mockUseCode.mockImplementation(() => timeToCodeWithTZ(curtain, localTimezoneIndex()));
    mockUseAppState.mockImplementation(() => [{ doorsOpen: 30, doorsClosed: 'undefined' }]);
  });

  it('returns undefined for invalid codes', () => {
    mockUseCode.mockImplementation(() => 'totallyboguscode');
    const { result } = renderHook(useShowtime);
    expect(result.current).toBeUndefined();
  });

  it('returns the right curtaion time', () => {
    const { result } = renderHook(useShowtime);
    expect(result.current?.curtain.toISO()).toBe(DateTime.fromJSDate(curtain).toISO());
  })

  it('sets open time to curtain minus doors open', () => {
    [30, 25, 20, 10, 5].forEach((n) => {
      mockUseAppState.mockImplementation(() => [{ doorsOpen: n, doorsClosed: 'undefined' }]);
      const { result } = renderHook(useShowtime);
      const expected = DateTime.fromJSDate(curtain).minus({ minutes: n });
      expect(result.current?.open.toISO()).toBe(expected.toISO());
    })
  });

  it('uses default door policy if doorsClosed is undefined', () => {
    mockUseAppState.mockImplementation(() => [{ doorsOpen: 30, doorsClosed: 'undefined' }]);
    const { result } = renderHook(useShowtime);
    const expected = DateTime.fromJSDate(curtain).plus({ minutes: DEFAULT_DOOR_POLICY.close });
    expect(result.current?.close.toISO()).toBe(expected.toISO());
  });

  it('uses doorsClosed if its defined', () => {
    const closeTime = DateTime.local().toISO();
    mockUseAppState.mockImplementation(() => [{ doorsOpen: 30, doorsClosed: closeTime }]);
    const { result } = renderHook(useShowtime);
    const expected = DateTime.fromJSDate(curtain).plus({ minutes: DEFAULT_DOOR_POLICY.close });
    expect(result.current?.close.toISO()).toBe(closeTime);
  });
})
