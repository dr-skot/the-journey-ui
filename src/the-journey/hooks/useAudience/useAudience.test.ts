import { act, renderHook } from '@testing-library/react-hooks';
import useParticipants from '../useParticipants/useParticipants';
import { useAppState } from '../../contexts/AppStateContext';
import useAudience from './useAudience';

jest.mock('../useParticipants/useParticipants');
const mockUseParticipants = useParticipants as jest.Mock;

jest.mock('../../contexts/AppStateContext');
const mockUseAppState = useAppState as jest.Mock;

describe('useAudience', () => {
  const mockParticipants = [
    { identity: 'foh|foh|10' },
    { identity: 'dude|audience|12' },
    { identity: 'operator|operator|13' },
    { identity: 'lurker|lurker|09' },
    { identity: 'bob|audience|14' },
    { identity: 'alice|audience|14' },
    { identity: 'focus|focus|17' },
  ];

  beforeEach(() => {
    mockUseParticipants.mockImplementation(() => mockParticipants);
    mockUseAppState.mockImplementation(() => [{
      helpNeeded: [],
      notReady: [],
      excluded: [],
      meetings: [],
    }]);
  });

  it('doesnt show non-audience roles', () => {
    const { result } = renderHook(useAudience);
    expect(result.current).toEqual([
      { identity: 'dude|audience|12' },
      { identity: 'bob|audience|14' },
      { identity: 'alice|audience|14' },
    ])
  });

  it('doesnt show users who are in a meeting', () => {
    mockUseAppState.mockImplementation(() => [{
        helpNeeded: [],
        notReady: [],
        excluded: [],
        meetings: [['alice|audience|14', 'foh|foh|10']],
      }]);
    const { result } = renderHook(useAudience);
    expect(result.current).toEqual([
      { identity: 'dude|audience|12' },
      { identity: 'bob|audience|14' },
    ]);
  });

  it('doesnt show users who arent ready', () => {
    mockUseAppState.mockImplementation(() => [{
      helpNeeded: [],
      notReady: ['bob|audience|14'],
      excluded: [],
      meetings: [],
    }]);
    const { result } = renderHook(useAudience);
    expect(result.current).toEqual([
      { identity: 'dude|audience|12' },
      { identity: 'alice|audience|14' },
    ])
  });
})
