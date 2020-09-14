import Video from 'twilio-video';
import { SubscribeProfile } from './twilio';

function getToken(roomName: string, identity: string) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ identity, roomName });
  return fetch(`${endpoint}?${params}`, { headers }).then(res => res.text());
}

function connect(token: string, options: Video.ConnectOptions = {}) {
  return Video.connect(token, { tracks: [], automaticSubscription: false, ...options });
}

export function joinRoom(roomName: string, identity: string,
                         subscribeProfile: SubscribeProfile = 'data-only',
                         options: Video.ConnectOptions = {}) {
  console.log('joining', roomName, identity, subscribeProfile, options);
// @ts-ignore
  return getToken(roomName, identity).then(token => connect(token, options));
}
