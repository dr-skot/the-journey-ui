import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useParticipants from './useParticipants';
import { useAppContext } from '../../contexts/AppContext';

jest.mock('../../contexts/AppContext');

const mockUseAppContext = useAppContext as jest.Mock;

describe('the useParticipants hook', () => {
  let mockRoom: any;
  const mockParticipants = [
    { identity: 'guy|role|10' },
    { identity: 'dude|role|12' },
    { identity: 'lady|role|13' },
    { identity: 'reconnector|role|09' },
  ];

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockRoom.localParticipant = { identity: 'me|audience|11'}
    mockRoom.participants = new Map([
      [0, mockParticipants[0]],
      [1, mockParticipants[1]],
    ]);
    mockUseAppContext.mockImplementation(() => ([{ room: mockRoom }]));
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const { result } = renderHook(useParticipants);
    expect(result.current).toEqual(mockParticipants.slice(0, 2));
  });

  it('should return respond to "participantConnected" events', async () => {
    const { result } = renderHook(useParticipants);
    act(() => {
      mockRoom.participants.set(2, mockParticipants[2]);
      mockRoom.emit('participantConnected', mockParticipants[2]);
    });
    expect(result.current).toEqual(mockParticipants.slice(0, 3));
  });

  it('should return respond to "participantDisconnected" events', async () => {
    const { result } = renderHook(useParticipants);
    act(() => {
      mockRoom.participants.delete(0);
      mockRoom.emit('participantDisconnected', mockParticipants[0]);
    });
    expect(result.current).toEqual(mockParticipants.slice(1,2));
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(useParticipants);
    unmount();
    expect(mockRoom.listenerCount('participantConnected')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
  });

  it('should find participants in a new room', async () => {
    mockUseAppContext.mockImplementation(() => [{ room: undefined }]);
    const { result, rerender } = renderHook(useParticipants);
    expect(result.current).toEqual([]);
    mockUseAppContext.mockImplementation(() => [{ room: mockRoom }]);
    rerender();
    expect(result.current).toEqual(mockParticipants.slice(0, 2));
  });

  it('sorts participants by timestamp', () => {
    const { result } = renderHook(useParticipants);
    act(() => {
      mockRoom.participants.set(2, mockParticipants[3]);
      mockRoom.emit('participantConnected', mockParticipants[3]);
    });
    expect(result.current).toEqual([mockParticipants[3], ...mockParticipants.slice(0, 2)]);
  });

  it('includes the local participant (in timestamp order) when asked to', () => {
    // @ts-ignore
    const { result } = renderHook(useParticipants, { initialProps: 'includeMe' });
    expect(result.current).toEqual([mockParticipants[0], mockRoom.localParticipant, mockParticipants[1]]);
  });

});
