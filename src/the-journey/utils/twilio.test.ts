import { checkForOperator, getParticipantList } from './twilio';

var globalRef: any = global;

describe('getParticipantList', () => {

  let oldFetch: any;
  let mockSuccessResponse = { participants: ['Joe|audience|1', 'Mom|audience|2'] };

  beforeAll(() => {
    oldFetch = globalRef.fetch;
    globalRef.fetch = jest.fn(() => {
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      return Promise.resolve({ json: () => Promise.resolve(mockSuccessResponse) });
    });
  });

  afterAll(() => {
    globalRef.fetch = oldFetch;
  })

  beforeEach(() => {
    globalRef.fetch.mockClear();
  });

  it('fetches the results of /participant', async (done) => {
    const participants = await getParticipantList('roomName');

    expect(globalRef.fetch).toHaveBeenCalledTimes(1);
    expect(participants).toEqual(mockSuccessResponse.participants);
    done();
  });

  describe('checkForOperator', () => {
    it('returns false if theres no operator', async (done) => {
      mockSuccessResponse = { participants: ['Joe|audience|1', 'Mom|audience|2'] };
      const isOperator = await checkForOperator('roomName');

      expect(globalRef.fetch).toHaveBeenCalledTimes(1);
      expect(isOperator).toBe(false);
      done();
    });
    it('returns true if theres an operator', async (done) => {
      mockSuccessResponse = { participants: ['Joe|audience|1', 'operator|operator|2'] };
      const isOperator = await checkForOperator('roomName');

      expect(globalRef.fetch).toHaveBeenCalledTimes(1);
      expect(isOperator).toBe(true);
      done();
    });
  });
})

