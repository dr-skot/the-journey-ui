const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const Twilio = require('twilio');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const URLSearchParams = require('url').URLSearchParams;
const roomStateManager = require('./room-state-manager');

require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const base64 = (string) => Buffer.from(string, 'utf-8').toString('base64');
function noop() {}

// support json body and form data in post requests
app.use(bodyParser.json());

//
// http -> https forwarding
//

const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
if (!isDev()) {

  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol. See
  // http://expressjs.com/api#app-settings for more details.
  app.enable('trust proxy');

  // Add a handler to inspect the req.secure flag (see
  // http://expressjs.com/api#req.secure). This allows us
  // to know whether the request was via http or https.
  app.use(function(req, res, next) {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}


//
// password checking
//
const passwords = {
  foh: 'hoffa',
  lurker: 'sliver',
  operator: 'xxxx',
}
app.post('/auth', (req, res) => {
  const password = req.body.password;
  const roles = (req.body.roles || '').split('|');
  console.log('got auth request', password, roles.join('|'), req.body);
  if (!password) {
    res.json({ error: 'No password sent!', success: 'false' });
    return;
  }
  const role = roles.find((role) => passwords[role] === password);
  res.json({ success: !!role, role: role });
});


//
// twilio room-join token
//

app.use(express.static(path.join(__dirname, 'build')));
const port = process.env.PORT || 8081;

app.get('/token', (req, res) => {
  console.log('token requested');
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});


//
// twilio track subscription
//

const SUBSCRIBE_RULES = {
  basic: () => [
    { type: 'exclude', all: true },
    { type: 'include', kind: 'data' },
  ],

  listen: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p, kind: 'audio' })),
  watch: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p, kind: 'video' })),
  spy: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p })),

  focus: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p })),
  'focus-safer': (publishers) => [
    { type: 'include', kind: 'audio' },
    ...publishers.map((p) => ({ type: 'include', publisher: p, kind: 'video' }))
  ],

  gallery: (eavesdrop) => [
    { type: 'include', kind: 'video' },
    ...eavesdrop.map((p) => ({ type: 'include', publisher: p, 'kind': 'audio' })),
  ],

  audio: () => [{ type: 'include', kind: 'audio' }],
  nothing: () => [{ type: 'exclude', all: true }],
}

app.get('/subscribe/:room/:user/:policy', (req, res) => {
  if (req.params.policy === 'none') { res.end(); return; } // supprort this noop for completeness
  const focus = (req.query.focus || '').split(',') || [];
  const stars = (req.query.stars || '').split(',') || [];
  const basicRules = SUBSCRIBE_RULES.basic();
  const moreRules = (SUBSCRIBE_RULES[req.params.policy] || noop)(focus) || [];
  const rules = basicRules
    .concat(moreRules)
    .concat(stars.map(star => ({ type: 'include', publisher: star })));

  console.log('subscribe', req.params.room, req.params.user, req.params.policy);

  const url = `https://video.twilio.com/v1/Rooms/${req.params.room}/Participants/${req.params.user}/SubscribeRules`;
  const auth = `${twilioApiKeySID}:${twilioApiKeySecret}`
  const rulesJson = JSON.stringify(rules);

  const curl = `curl -X POST ${url} -u '${auth}' --data Rules='${rulesJson}' -H 'Content-Type: application/x-www-form-urlencoded'`;
  console.log(curl);

  const params = new URLSearchParams();
  params.append('Rules', rulesJson);

  fetch(url, { method: 'post', body: params, headers: { 'Authorization': `Basic ${base64(auth)}` } })
    .then(response => {
      console.log('success');
      res.end(response.body.read());
    })
  // TODO find out what's the right way to handle this
  // .catch(error => { console.log(json); res.end(error.body.read()); });
});

app.get('/subscribe/*', (req, res) => {
  console.log('uncaught subscribe request!');
  res.send('Error: bad subscribe request');
})


//
// other twilio functions
//

app.get('/disconnect/:room/:user', (req, res) => {
  const url = `https://video.twilio.com/v1/Rooms/${req.params.room}/Participants/${req.params.user}`;
  const auth = `${twilioApiKeySID}:${twilioApiKeySecret}`

  const curl = `curl -X POST ${url} -u '${auth}' -d 'Status=disconnected' -H 'Content-Type: application/x-www-form-urlencoded'`;
  console.log(curl);

  const params = new URLSearchParams();
  params.append('Status', 'disconnected');

  fetch(url, { method: 'post', body: params, headers: { Authorization: `Basic ${base64(auth)}` } })
    .then(response => {
      console.log('success');
      res.end(response.body.read());
    })
});

app.get('/clear/:room', (req, res) => {
  const url = `https://video.twilio.com/v1/Rooms/${req.params.room}`;
  const auth = `${twilioApiKeySID}:${twilioApiKeySecret}`

  // curl -X POST https://video.twilio.com/v1/Rooms/room2 --data-urlencode "Status=completed"
  const curl = `curl -X POST ${url} -u '${auth}' -d 'Status=completed' -H 'Content-Type: application/x-www-form-urlencoded'`;
  console.log(curl);

  const params = new URLSearchParams();
  params.append('Status', 'completed');

  fetch(url, { method: 'post', body: params, headers: { Authorization: `Basic ${base64(auth)}` } })
    .then(response => {
      console.log('success');
      res.end(response.body.read());
    })
})

app.get('/participants/:room', (req, res) => {
  const url = `https://video.twilio.com/v1/Rooms/${req.params.room}/Participants`;
  const auth = `${twilioApiKeySID}:${twilioApiKeySecret}`

  const curl = `curl -X GET ${url} -u '${auth}'`;
  console.log(curl);

  fetch(url, { method: 'get', headers: { 'Authorization': `Basic ${base64(auth)}` } })
    .then(response => {
      console.log('success');
      res.end(response.body.read());
    })
  // TODO find out what's the right way to handle this
    // .catch(error => { console.log(json); res.end(error.body.read()); });
})



//
// millicast relays
//

// relay millicast turn server
app.put('/millicast/turn', (req, res) => {
  const turnUrl  = 'https://turn.millicast.com/webrtc/_turn';
  fetch(turnUrl, { method: 'put' }).then(response => {
    res.end(response.body.read());
  })
});

// relay millicast subscribe
app.post('/millicast/subscribe', (req, res) => {
  const apiPath  = 'https://director.millicast.com/api/director/subscribe';
  fetch(apiPath, {
    method: 'post',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  }).then(response => {
     res.end(response.body.read());
  });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
});

const server = isDev()
  ? https.createServer({
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
  }, app)
  : http.createServer(app);

roomStateManager.useServer(server);

server.listen(port, () => console.log(`server running on ${port}`));
