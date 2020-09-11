import { act, renderHook } from '@testing-library/react-hooks';
import useLocalVideoToggle from './useLocalVideoToggle';
import { EventEmitter } from 'events';
import { LocalParticipant } from 'twilio-video';
import { useAppContext } from '../../contexts/AppContext';
import useLocalTracks from '../../../twilio/components/VideoProvider/useLocalTracks/useLocalTracks';

jest.mock('../../contexts/AppContext');
jest.mock('../../../twilio/components/VideoProvider/useLocalTracks/useLocalTracks');

const mockUseAppContext = useAppContext as jest.Mock<any>;
const mockUseLocalTracks = useLocalTracks as jest.Mock<any>;

function getMockTrack(name: string, deviceId?: string) {
  return {
    name,
    mediaStreamTrack: {
      getSettings: () => ({
        deviceId,
      }),
    },
  };
}

describe('the useLocalVideoToggle hook', () => {
  it('should return true when a localVideoTrack exists', () => {
    mockUseAppContext.mockImplementation(() => [{
      room: { localParticipant: {} },
      localTracks: [getMockTrack('camera-123456')],
    }]);
    mockUseLocalTracks.mockImplementation(() => ({}));

    const { result } = renderHook(useLocalVideoToggle);
    expect(result.current).toEqual([true, expect.any(Function)]);
  });

  it('should return false when a localVideoTrack does not exist', () => {
    mockUseAppContext.mockImplementation(() => [{
      room: { localParticipant: {} },
      localTracks: [getMockTrack('microphone')],
    }]);

    const { result } = renderHook(useLocalVideoToggle);
    expect(result.current).toEqual([false, expect.any(Function)]);
  });

  describe('toggleVideoEnabled function', () => {
    it('should call removeLocalVideoTrack when a localVideoTrack exists', () => {
      const mockRemoveLocalVideoTrack = jest.fn();

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: null },
        localTracks: [getMockTrack('camera')],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        removeLocalVideoTrack: mockRemoveLocalVideoTrack,
      }));

      const { result } = renderHook(useLocalVideoToggle);
      result.current[1]();
      expect(mockRemoveLocalVideoTrack).toHaveBeenCalled();
    });

    it('should call localParticipant.unpublishTrack when a localVideoTrack and localParticipant exists', () => {
      const mockLocalTrack = {
        ...getMockTrack('camera-123456'),
        stop: jest.fn(),
      };

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.unpublishTrack = jest.fn();

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: mockLocalParticipant },
        localTracks: [mockLocalTrack],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        removeLocalVideoTrack: () => {},
      }));

      const { result } = renderHook(useLocalVideoToggle);
      result.current[1]();
      expect(mockLocalParticipant.unpublishTrack).toHaveBeenCalledWith(mockLocalTrack);
    });

    it('should call getLocalVideoTrack when a localVideoTrack does not exist', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.resolve());

      mockUseAppContext.mockImplementation(() => [{
        room: {},
        localTracks: [],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));

      const { result, waitForNextUpdate } = renderHook(useLocalVideoToggle);
      act(() => {
        result.current[1]();
      });
      await waitForNextUpdate();
      expect(mockGetLocalVideoTrack).toHaveBeenCalled();
    });

    it('should call mockLocalParticipant.publishTrack when a localVideoTrack does not exist and localParticipant does exist', async done => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.resolve('mockTrack'));

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.publishTrack = jest.fn();

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: mockLocalParticipant },
        localTracks: [],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));

      const { result, waitForNextUpdate } = renderHook(useLocalVideoToggle);
      act(() => {
        result.current[1]();
      });
      await waitForNextUpdate();
      setImmediate(() => {
        expect(mockLocalParticipant.publishTrack).toHaveBeenCalledWith('mockTrack', { priority: 'low' });
        done();
      });
    });

    it('should not call mockLocalParticipant.publishTrack when isPublishing is true', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.resolve('mockTrack'));

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.publishTrack = jest.fn();

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: mockLocalParticipant },
        localTracks: [],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));

      const { result, waitForNextUpdate } = renderHook(useLocalVideoToggle);
      act(() => {
        result.current[1]();
      });
      result.current[1](); // Should be ignored because isPublishing is true
      expect(mockGetLocalVideoTrack).toHaveBeenCalledTimes(1);
      await waitForNextUpdate();
    });
/*
    it('should call onError when publishTrack throws an error', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.resolve('mockTrack'));
      const mockOnError = jest.fn();

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.publishTrack = jest.fn(() => Promise.reject('mockError'));

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: mockLocalParticipant },
        localTracks: [],
        onError: mockOnError,
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));

      const { result, waitForNextUpdate } = renderHook(useLocalVideoToggle);
      act(() => {
        result.current[1]();
      });
      await waitForNextUpdate();
      expect(mockOnError).toHaveBeenCalledWith('mockError');
    });
 */
    it('should call getLocalVideoTrack with the deviceId of the previously active track', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.resolve('mockTrack'));

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: null },
        localTracks: [getMockTrack('camera', 'testDeviceID')],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        removeLocalVideoTrack: jest.fn(),
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));

      const { result, rerender, waitForNextUpdate } = renderHook(useLocalVideoToggle);

      // Remove existing track
      result.current[1]();

      mockUseAppContext.mockImplementation(() => [{
        room: { localParticipant: null },
        localTracks: [],
      }]);
      mockUseLocalTracks.mockImplementation(() => ({
        removeLocalVideoTrack: jest.fn(),
        getLocalVideoTrack: mockGetLocalVideoTrack,
      }));
      rerender();

      await act(async () => {
        // Get new video track
        result.current[1]();
        await waitForNextUpdate();
      });

      expect(mockGetLocalVideoTrack).toHaveBeenCalledWith({ deviceId: { exact: 'testDeviceID' } });
    });
  });
});
