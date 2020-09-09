const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const Twilio = require('twilio');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const URLSearchParams = require('url').URLSearchParams;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const base64 = (string) => Buffer.from(string, 'utf-8').toString('base64');

function noop() {}

SUBSCRIBE_RULES = {
  basic: () => [
    { type: 'exclude', all: true },
    { type: 'include', kind: 'data' },
  ],
  listen: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p, 'kind': 'audio' })),
  gallery: () => [{ type: 'include', kind: 'video' }],
  focus: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p })),
  audio: () => [{ type: 'include', kind: 'audio' }],
  nothing: () => [{ type: 'exclude', all: true }],
}

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

// TODO implement this
/*
app.use (function (req, res, next) {
  if (req.secure) { // request was via https, so do no special handling
    next();
  } else { // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});
*/

app.get('/subscribe/:room/:user/:policy', (req, res) => {
  if (req.params.policy === 'none') { res.end(); return; } // supprort this noop for completeness
  const client = new Twilio(twilioApiKeySID, twilioApiKeySecret, {accountSid: twilioAccountSid});
  const focus = req.query.focus || '';
  const basicRules = SUBSCRIBE_RULES.basic();
  const moreRules = (SUBSCRIBE_RULES[req.params.policy] || noop)(focus.split(',') || []) || [];
  const rules = basicRules.concat(moreRules);

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

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
});

app.listen(port, () => console.log(`token server running on ${port}`));
