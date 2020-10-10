
// data expires after 5 days of no activity; check every day
const EXPIRE_TIME = 5 * 24 * 60 * 60 * 1000;
const EXPIRY_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

const DEFAULT_GAIN = 0.8;
const DEFAULT_DELAY = 0;

const GROUPS = ['admitted', 'rejected', 'focusGroup', 'mutedInFocusGroup', 'helpNeeded', 'notReady', 'excluded'];
const SETTINGS = ['doorsClosed', 'gain', 'delayTime', 'muteAll'];

function tryToParse(string: string) {
  try { return JSON.parse(string) } catch { return undefined }
}

function remove(xs: any[], x: any) {
  const i = xs.indexOf(x);
  if (i === -1) return;
  xs.splice(i, 1);
  remove(xs, x); // get all of them
}

function insureMembership(xs: any[], x: any) {
  if (!xs) return [x];
  if (xs.indexOf(x) === -1) xs.push(x);
  return xs;
}

function isMember(xs: any[], x: any) {
  return xs.indexOf(x) > -1;
}

function toggleMembership(xs: any[], x: any) {
  if (isMember(xs, x)) remove(xs, x);
  else xs.push(x);
}

function setMembership(xs: any[], x: any, value: boolean) {
  if (isMember(xs, x) !== value) toggleMembership(xs, x);
}


function endMeetings(roomState: any, identity: string) {
  roomState.meetings = roomState.meetings.filter((meeting: string[]) => !meeting.includes(identity));
}

function removeParticipant(roomState: any, identity: string) {
  GROUPS.forEach((group) => remove(roomState[group], identity));
  delete roomState.userAgents[identity];
  endMeetings(roomState, identity);
  pullRoommate(roomState, identity); removeEmptyRoommateGroups(roomState);
}

function roommateRotate(roommates: string[][], identity: string) {
  const roomNumber = pullRoommate(roommates, identity);
  const wasAloneInRoom = roomNumber > 0 && roommates[roomNumber - 1].length === 0;
  // if we weren't alone in the last room, join or create next room
  if (!wasAloneInRoom || roomNumber < roommates.length) {
    roommates[roomNumber] = roommates[roomNumber] || [];
    roommates[roomNumber].push(identity);
  }
  removeEmptyRoommateGroups(roommates);
}

function pullRoommate(roommates: string[][], identity: string) {
  const roomNumber = 1 + roommates.findIndex((group) => group.includes(identity));
  if (roomNumber > 0) remove(roommates[roomNumber - 1], identity);
  return roomNumber;
}

function removeEmptyRoommateGroups(roommates: string[][]) {
  roommates.filter((group) => group.length === 0).forEach((empty) => remove(roommates, empty));
}

export const initWebSocketServer = (wss: any) => {
  console.log("websocket server starting up");

  const clients: Record<string, any> = {}; // { roomName: wsConnection[] }
  const roomStates: Record<string, any> = {}; // { roomName: roomState }
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
    notReady: [],
    excluded: [],
    roommates: [],
  });

  // periodically purge old room state data
  const lastActivity: Record<string, number> = {} // { roomName: unix-time }
  setInterval(() => {
    Object.keys(roomStates).forEach((key) => {
      if (!lastActivity[key] || Date.now() - lastActivity[key] > EXPIRE_TIME) {
        delete roomStates[key];
        delete lastActivity[key];
      }
    }, EXPIRY_CHECK_INTERVAL);
  });


  function getRoomState(roomName: string) {
    if (!roomStates[roomName]) roomStates[roomName] = newRoomState();
    return roomStates[roomName];
  }

  function sendRoomStateUpdate(roomState: any, ws: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'roomStateUpdate', payload: roomState }));
    }
  }

  function broadcastUpdate(roomName: string) {
    console.log('broadcasting update!');
    const roomState = getRoomState(roomName);
    (clients[roomName] || []).forEach((ws: any) => {
      sendRoomStateUpdate(roomState, ws);
    });
  }

  wss.on('connection', (ws: any) => {
    console.log('got connection');
    ws.on('message', async (message: string) => {
      console.log('got message!');
      try {
        const request = tryToParse(message);
        const { action, payload } = request || {};
        const { roomName, identity } = payload || {};
        let roomState = roomStates[roomName] || newRoomState();
        roomStates[roomName] = roomState;
        lastActivity[roomName] = Date.now();
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
              payload.meeting.forEach((identity: string) => endMeetings(roomState, identity));
              roomState.meetings.push(payload.meeting);
            }
            break;
          case 'endMeeting':
            if (payload.meeting) {
              payload.meeting.forEach((identity: string) => endMeetings(roomState, identity));
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

exports.initWebSocketServer = initWebSocketServer;
