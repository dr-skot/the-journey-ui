import { tryToParse } from '../utils/functional';

// buffer messages until open
// JSON parse/stringify messages
// pong when pinged
// reconnect when connection lost

const DEFAULT_RETRY_INTERVAL = 3000;

interface Request {
  action: string,
  payload: any,
}

type WebSocketMessageListener = (message: any) => void;

interface RobustWebSocket {
  url: string,
  messageListeners: WebSocketMessageListener[],
  webSocket: WebSocket,
  retryInterval: number,
}

const isPingPong = (message: Request) => !!message.action?.match(/^p[io]ng$/);

class RobustWebSocket {
  constructor(webSocketUrl: string) {
    this.url = webSocketUrl;
    this.messageListeners = [];
    this.webSocket = this.getWebsocket();
    this.retryInterval = DEFAULT_RETRY_INTERVAL;
  }

  getWebsocket = () => {
    const webSocket = new WebSocket(this.url);
    webSocket.addEventListener('open', this.handleOpen);
    webSocket.addEventListener('message', this.handleMessage);
    webSocket.addEventListener('close', this.handleClose);
    return webSocket;
  };

  addMessageListener = (listener: WebSocketMessageListener) => {
    this.messageListeners.push(listener);
  };

  removeMessageListener = (listener: WebSocketMessageListener) => {
    this.messageListeners = this.messageListeners.filter((f) => f !== listener);
  };

  isConnected = () => this.webSocket.readyState === WebSocket.OPEN;

  send(message: any) {
    const { webSocket } = this;
    const doIt = () => {
      // eslint-disable-next-line no-console
      if (!isPingPong(message)) console.log('websocket sending', message);
      webSocket.send(JSON.stringify(message));
    };
    if (this.isConnected()) doIt();
    else webSocket.addEventListener('open', doIt);
  };

  // eslint-disable-next-line no-console
  handleOpen = () => console.log(`connected to websocket server at ${this.webSocket.url}`);

  handleMessage = (messageEvent: MessageEvent) => {
    const message = tryToParse(messageEvent.data as string);
    // eslint-disable-next-line no-console
    if (!isPingPong(message)) console.log(`websocket received ${message.action}`, { message });
    if (message.action === 'ping') this.send({ action: 'pong' });
    else this.messageListeners.forEach((listener) => listener(message));
  };

  handleClose = (closeEvent: CloseEvent) => {
    // eslint-disable-next-line no-console
    console.log('websocket closed', closeEvent);
    this.closeWebsocket(this.webSocket);
    const self = this;
    setTimeout(() => { self.webSocket = self.getWebsocket(); }, this.retryInterval);
  };

  closeWebsocket = (webSocket: WebSocket) => {
    webSocket.removeEventListener('open', this.handleOpen);
    webSocket.removeEventListener('message', this.handleMessage);
    webSocket.removeEventListener('close', this.handleClose);
    webSocket.close();
  };
}

export default RobustWebSocket;
