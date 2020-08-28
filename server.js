const express = require('express');
const app = express();
const path = require('path');
const Twilio = require('twilio');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

function noop() {}

SUBSCRIBE_RULES = {
  basic: () => [
    { type: 'exclude', all: true },
    { type: 'include', publisher: 'admin-user', kind: 'data' },
  ],
  listen: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p, 'kind': 'audio' })),
  gallery: () => [{ type: 'include', kind: 'video' }],
  enlarger: (publishers) => publishers.map((p) => ({ type: 'include', publisher: p })),
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
  const client = new Twilio(twilioApiKeySID, twilioApiKeySecret, {accountSid: twilioAccountSid});
  const focus = req.query.focus || '';
  const basicRules = SUBSCRIBE_RULES.basic();
  const moreRules = (SUBSCRIBE_RULES[req.params.policy] || noop)(focus.split(',') || []) || [];
  const rules = basicRules.concat(moreRules);

  console.log('subscribe', req.params.room, req.params.user, req.params.policy);
  console.log(JSON.stringify(rules, null, 1));

  try {
    client.video.rooms(req.params.room).participants.get(req.params.user).subscribeRules.update({
      rules: rules
    }).then(result => {
        console.log('Subscribe Rules updated successfully', room, user, policy, focus );
        res.send('Subscribe Rules updated successfully');
      }).catch(error => {
        console.log('Error updating rules', error, room, user, policy, focus);
        res.send('Error updating rules ' + error);
      });
  } catch (error) {
    console.log('Error updating rules', error, room, user, policy, focus);
    res.send('Error updating rules ' + error);
  }

});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(port, () => console.log(`token server running on ${port}`));
