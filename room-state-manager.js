const WebSocket = require('ws');

const DEFAULT_GAIN = 0.8;
const DEFAULT_DELAY = 0;

const GROUPS = ['admitted', 'rejected', 'focusGroup', 'mutedInFocusGroup', 'helpNeeded'];
const SETTINGS = ['doorsClosed', 'gain', 'delayTime', 'muteAll'];

function tryToParse(string) {
  try { return JSON.parse(string) } catch { return undefined }
}

function remove(xs, x) {
  const i = xs.indexOf(x);
  if (i === -1) return;
  xs.splice(i, 1);
  remove(xs, x); // get all of them
}

function insureMembership(xs, x) {
  if (!xs) return [x];
  if (xs.indexOf(x) === -1) xs.push(x);
  return xs;
}

function toggleMembership(xs, x) {
  if (xs.indexOf(x) > -1) remove(xs, x);
  else xs.push(x);
}

function endMeetings(roomState, identity) {
  roomState.meetings = roomState.meetings.filter((meeting) => !meeting.includes(identity));
}

function removeParticipant(roomState, identity) {
  GROUPS.forEach((group) => remove(roomState[group], identity));
  delete roomState.userAgents[identity];
  endMeetings(roomState, identity);
}


const useServer = (server) => {
  const wss = new WebSocket.Server({ server });

  const clients = {}; // { roomName: wsConnection[] }
  const roomStates = {}; // { roomName: roomState }
  const newRoomState = () => ({
      admitted: [],
      rejected: [],
      doorsClosed: 'undefined',
      focusGroup: [],
      mutedInFocusGroup: [],
      gain: DEFAULT_GAIN,
      delayTime: DEFAULT_DELAY,
      muteAll: false,
      meetings: [],
      userAgents: {},
      helpNeeded: [],
  });

  function getRoomState(roomName) {
    if (!roomStates[roomName]) roomStates[roomName] = newRoomState();
    return roomStates[roomName];
  }

  function sendRoomStateUpdate(roomState, ws) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'roomStateUpdate', payload: roomState }));
    }
  }

  function broadcastUpdate(roomName) {
    const roomState = getRoomState(roomName);
    (clients[roomName] || []).forEach((ws) => {
      sendRoomStateUpdate(roomState, ws);
    });
  }

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const request = tryToParse(message);
      const { action, payload } = request || {};
      const { roomName, identity } = payload || {};
      let roomState = roomStates[roomName] || newRoomState();
      roomStates[roomName] = roomState;
      if (action !== 'ping') console.log('websocket message', message);
      switch (action) {
        case 'ping':
          ws.send(JSON.stringify({ action: 'pong' }));
          return;
        case 'getRoomState':
          sendRoomStateUpdate(getRoomState(roomName), ws);
          return;
        case 'joinRoom':
          clients[roomName] = insureMembership(clients[roomName], ws);
          if (identity) roomState.userAgents[identity] = payload.userAgent;
          break;
        case 'leaveRoom':
          remove(clients[roomName], ws);
          removeParticipant(roomState, identity);
          break;
        case 'set':
          Object.keys(payload).forEach((key) => {
            if (SETTINGS.includes(key)) {
              roomState[key] = payload[key];
            }
          });
          break;
        case 'toggleMembership':
          if (GROUPS.includes(payload.group)) {
            toggleMembership(roomState[payload.group], identity);
          }
          break;
        case 'clearMembership':
          if (GROUPS.includes(payload.group)) {
            roomState[payload.group] = [];
          }
          break;
        case 'startMeeting':
          if (payload.meeting) {
            payload.meeting.forEach((identity) => endMeetings(roomState, identity));
            roomState.meetings.push(payload.meeting);
          }
          break;
        case 'endMeeting':
          if (payload.meeting) {
            payload.meeting.forEach((identity) => endMeetings(roomState, identity));
          }
          break;
      }
      broadcastUpdate(roomName);
    });

    ws.send(JSON.stringify({ message: 'connected!' }));
  });
}

exports.useServer = useServer;
