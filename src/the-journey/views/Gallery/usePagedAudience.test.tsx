import { render, fireEvent } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import usePagedAudience, { columnSplit } from './usePagedAudience';
import useAudience from '../../hooks/useAudience/useAudience';
import { range } from 'lodash';

jest.mock('../../hooks/useAudience');

const mockUseAudience = useAudience as jest.Mock<any>;

describe('the usePagedAudience hook', () => {
  let mockAudience: any[] = [];
  beforeEach(() => {
    mockAudience = range(0, 30).map((i) =>
      [i, `participant${i}`]
    );
    mockUseAudience.mockImplementation(() => mockAudience);
  });

  it('should return a full gallery', () => {
    const { result } = renderHook(usePagedAudience);
    expect(result.current.gallery).toEqual(mockAudience);
  });

  it('should return a full order', () => {
    const { result } = renderHook(usePagedAudience);
    expect(result.current.order.length).toEqual(30);
  });

  it('should return a half order after pressing the paged button', () => {
    const { result } = renderHook(usePagedAudience);
    const { getByText } = render(result.current.menuButtons as React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    act(() => { fireEvent.click(getByText('two pages')) });
    expect(result.current.order.length).toEqual(15);
  });

  it('should return a full gallery after pressing the paged button', () => {
    const { result } = renderHook(usePagedAudience);
    const { getByText } = render(result.current.menuButtons as React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    act(() => { fireEvent.click(getByText('two pages')) });
    expect(result.current.gallery.length).toEqual(30);
  });


});


describe('columnSplit', () => {
  it('splits an array into columns', () => {
    const array =
      [  1,  3,  5,  2,  4,  6,
        7,  9, 11,  8, 10, 12,
        13, 15, 17, 14, 16, 18,
        19, 21, 23, 20, 22, 24,
        25, 27, 29, 26, 28, 30 ];
    expect(columnSplit(6, 1, array)).toEqual([1,3,5,7,9,11,13,15,17,19,21,23,25,27,29]);
    expect(columnSplit(6, 2, array)).toEqual([2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]);
  })
});

