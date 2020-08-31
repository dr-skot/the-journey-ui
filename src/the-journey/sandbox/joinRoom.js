import Video from 'twilio-video';
import { SubscribeProfile } from '../hooks/useTrackSubscriber';

function getToken(roomName, identity) {
  const headers = new window.Headers();
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ identity, roomName });
  return fetch(`${endpoint}?${params}`, { headers }).then(res => res.text());
}

function connect(token, options = {}) {
  return Video.connect(token, { tracks: [], automaticSubscription: false, ...options });
}

export function joinRoom(roomName, identity,
                         subscribeProfile = 'data-only',
                         options = {}) {
  console.log('joining', roomName, identity, subscribeProfile, options);
  return getToken(roomName, identity).then(token => connect(token, options));
}
