const WebSocket = require('ws');

const db = require('./mysql-persist-json');
const getSavedRoomStates = async () => await db.getAllData();
const saveRoomState = (roomName, roomState) => db.saveData(roomName, roomState);

// TODO consolidate this with constants.ts
const DEFAULT_GAIN = 0.8;
const DEFAULT_DELAY = 0;
const DEFAULT_DOOR_POLICY = { open: 30 };

const GROUPS = ['admitted', 'rejected', 'focusGroup', 'mutedInFocusGroup', 'helpNeeded', 'notReady', 'excluded'];
const SETTINGS = ['doorsOpen', 'doorsClosed', 'gain', 'delayTime', 'muteAll'];

const newRoomState = () => ({
  admitted: [],
  rejected: [],
  doorsOpen: DEFAULT_DOOR_POLICY.open,
  doorsClosed: 'undefined',
  focusGroup: [],
  mutedInFocusGroup: [],
  gain: DEFAULT_GAIN,
  delayTime: DEFAULT_DELAY,
  muteAll: false,
  meetings: [],
  userAgents: {},
  helpNeeded: [],
  notReady: [],
  excluded: [],
  roommates: [],
});


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

function isMember(xs, x) {
  return xs.indexOf(x) > -1;
}

function toggleMembership(xs, x) {
  if (isMember(xs, x)) remove(xs, x);
  else xs.push(x);
}

function setMembership(xs, x, value) {
  if (isMember(xs, x) !== value) toggleMembership(xs, x);
}


function endMeetings(roomState, identity) {
  roomState.meetings = roomState.meetings.filter((meeting) => !meeting.includes(identity));
}

function removeParticipant(roomState, identity) {
  GROUPS.forEach((group) => remove(roomState[group], identity));
  delete roomState.userAgents[identity];
  endMeetings(roomState, identity);
  pullRoommate(roomState.roommates, identity);
  removeEmptyGroups(roomState.roommates);
}

function roommateRotate(roommates, identity) {
  const roomNumber = pullRoommate(roommates, identity);
  const wasAloneInRoom = roomNumber > 0 && roommates[roomNumber - 1].length === 0;
  // if we weren't alone in the last room, join or create next room
  if (!wasAloneInRoom || roomNumber < roommates.length) {
    roommates[roomNumber] = roommates[roomNumber] || [];
    roommates[roomNumber].push(identity);
  }
  removeEmptyGroups(roommates);
}

function pullRoommate(roommates, identity) {
  const roomNumber = 1 + roommates.findIndex((group) => group.includes(identity));
  if (roomNumber > 0) remove(roommates[roomNumber - 1], identity);
  return roomNumber;
}

function removeEmptyGroups(groups) {
  groups.filter((group) => group.length === 0).forEach((empty) => remove(groups, empty));
}

const useServer = (server) => {
  const wss = new WebSocket.Server({ server });
  initWebSocketServer(wss);
}

const initWebSocketServer = async (wss) => {
  console.log("websocket server starting up");

  const clients = {}; // { roomName: wsConnection[] }
  let roomStates = await getSavedRoomStates();

  setInterval(() => {
    Object.keys(roomStates).forEach((code) => {
      if (db.shouldExpire(code)) {
        delete roomStates[code];
        delete clients[code];
      }
    });
  }, 12 * 24 * 60 * 60 * 1000); // clean out old codes every 12 hrs

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
    saveRoomState(roomName, roomState).then();
  }

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      try {
        const request = tryToParse(message);
        const { action, payload } = request || {};
        const { roomName, identity } = payload || {};
        let roomState = getRoomState(roomName);
        clients[roomName] = insureMembership(clients[roomName], ws);
        if (!action.match(/ping|getRoomState/)) console.log('websocket message', message);
        switch (action) {
          case 'ping':
            ws.send(JSON.stringify({ action: 'pong' }));
            return;
          case 'getRoomState':
            sendRoomStateUpdate(getRoomState(roomName), ws);
            return;
          case 'joinRoom':
            // clients[roomName] = insureMembership(clients[roomName], ws);
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
          case 'setMembership':
            if (GROUPS.includes(payload.group)) {
              setMembership(roomState[payload.group], identity, payload.value);
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
          case 'roommateRotate':
            roommateRotate(roomState.roommates, identity);
            break;
        }
        broadcastUpdate(roomName);
      } catch (e) {
        console.error(e);
      }
    });

    ws.send(JSON.stringify({ message: 'connected!' }));
  });
}

exports.useServer = useServer;
exports.initWebSocketServer = initWebSocketServer;
