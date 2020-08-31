import React from 'react';
import { render } from '@testing-library/react';
import AudioElement from '../../../the-journey/components/audio/AudioElement';
import { useAppState } from '../../state';

const audioEl = document.createElement('audio');
audioEl.setSinkId = jest.fn();

const mockTrack = { attach: jest.fn(() => audioEl), detach: jest.fn(() => [audioEl]) } as any;

jest.mock('../../state');
const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ activeSinkId: '' }));

describe('the AudioTrack component', () => {
  beforeEach(jest.clearAllMocks);

  it('should add an audio element to the DOM when the component mounts', () => {
    render(<AudioElement track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalled();
    expect(mockTrack.detach).not.toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(audioEl);
    expect(audioEl.setSinkId).not.toHaveBeenCalledWith('mock-sink-id');
  });

  it('should remove the audio element from the DOM when the component unmounts', () => {
    const { unmount } = render(<AudioElement track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(null);
  });

  describe('with an activeSinkId', () => {
    it('should set the sinkId when the component mounts', () => {
      mockUseAppState.mockImplementationOnce(() => ({ activeSinkId: 'mock-sink-id' }));
      render(<AudioElement track={mockTrack} />);
      expect(audioEl.setSinkId).toHaveBeenCalledWith('mock-sink-id');
    });
  });
});
