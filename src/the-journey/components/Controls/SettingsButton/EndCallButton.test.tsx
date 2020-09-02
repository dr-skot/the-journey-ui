import React from 'react';
import { shallow } from 'enzyme';

import SettingsButton from './SettingsButton';

const mockRoom: any = { disconnect: jest.fn() };
jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({ room: mockRoom }));

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    const wrapper = shallow(<SettingsButton />);
    wrapper.simulate('click');
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });
});
