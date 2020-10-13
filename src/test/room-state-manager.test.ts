import WS from 'jest-websocket-mock';
import { initWebSocketServer } from '../../room-state-manager';

describe("the websocket server", () => {
  let server: WS;
  let client: WebSocket;
  beforeAll(async () => {
    server = new WS('ws://localhost:8081');
    await initWebSocketServer(server);
  })
  it('announces connection', (done) => {
    client = new WebSocket('ws://localhost:8081');
    client.onmessage = (message) => {
      expect(JSON.parse(message.data)).toEqual({ message: 'connected!' });
      done();
    };
  });
});
