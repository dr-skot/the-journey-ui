import React from 'react';
import { render } from '@testing-library/react';
import FlexibleGallery from './FlexibleGallery';
import { range } from 'lodash';

interface MockParticipantProp {
  participant: { identity: string },
}

jest.mock('../../components/Participant/ParticipantVideoWindow',
  () => ({ participant }: MockParticipantProp) => <div>{participant.identity}</div>);

describe('FlexibleGallery', () => {
  let mockParticipants: any[] = [];
  beforeEach(() => {
    mockParticipants = range(1, 31).map((i) =>
      ({ sid: `${i}`, identity: `participant${i}` })
    );
  });
  it('should display all participants if theres no order', () => {
    const { getByText } = render(<FlexibleGallery participants={mockParticipants}/>);
    expect(getByText('participant30')).toBeDefined();
  });
  it('should display all participants whose numbers are in the order, and not others', () => {
    const order =
        [ 25, 23, 11,
          13,  7,  1,
          17,  9,  3,
          21, 19,  5,
          29, 27, 15 ];
    const { getByText } = render(<FlexibleGallery participants={mockParticipants} order={order} fixedLength={15}/>);
    order.forEach((n) => {
      expect(getByText(`participant${n}`)).toBeDefined();
      expect(() => getByText(`participant${n+1}`)).toThrow();
    });
  })
  it('should display the participants in ordinary order if no order is provided', () => {
    const { debug, getByText } = render(<FlexibleGallery participants={mockParticipants} fixedLength={30}/>);
    range(1, 30).forEach((n) => {
      expect(getByText(`participant${n}`)).toBeDefined();
    });
  })
  it('should show empty placeholders if fixed length', () => {
    const { getAllByLabelText } = render(<FlexibleGallery participants={[]} fixedLength={30}/>);
    expect(getAllByLabelText('nobody').length).toBe(30);
  });
  it('should not show empty placeholders if not fixed length', () => {
    const { getByLabelText } = render(<FlexibleGallery participants={[]}/>);
    expect(() => getByLabelText('nobody')).toThrow();
  });
})
