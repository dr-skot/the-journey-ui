import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import AutoJoin from '../../components/AutoJoin';
import { listKey } from '../../utils/react-help';
import { RemoteParticipant } from 'twilio-video';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
import Subscribe from '../../subscribers/Subscribe';

const logLine = (s: string) => `${new Date().toLocaleTimeString()}: ${s}`; // TODO add timestamp

export default function Log() {
  const [{ room }] = useAppContext();
  const [{
    focusGroup, gain, muteAll, mutedInFocusGroup, admitted, rejected, meetings, userAgents, helpNeeded
  }] = useSharedRoomState();
  const [log, setLog] = useState<string[]>([]);
  const [startTime] = useState(new Date())

  const addToLog = useCallback((s: string) => {
    setLog((prev) => [...prev, logLine(s)])
  }, [setLog]);

  useEffect(() => {
    if (room) {
      const n = room.participants.size;
      addToLog(`entered room ${room.name} (${room.sid}) with ${n} participant${n === 1 ? '' : 's'}${n > 0 ? ':' : '.'}`);
      room.participants.forEach((p) => {
        addToLog(`${p.identity} with sid ${p.sid}`);
      });

      const participantConnected = (p: RemoteParticipant) =>
        addToLog(`${p.identity} connected, sid ${p.sid}`);
      const participantDisconnected = (p: RemoteParticipant) =>
        addToLog(`${p.identity} disconnected, sid ${p.sid}`);

      room.on('participantConnected', participantConnected)
        .on('participantDisconnected', participantDisconnected);

      return () => {
        room.off('participantConnected', participantConnected)
          .off('participantDisconnected', participantDisconnected);
      }
    }
  }, [room, addToLog]);

  useEffect(() => addToLog(`focus group set to [${focusGroup.join(', ')}]`),
    [focusGroup, addToLog])

  useEffect(() => addToLog(`volume set to ${gain}`),
    [gain, addToLog]);

  useEffect(() => addToLog(`muteAll set to ${muteAll}`),
    [muteAll, addToLog]);

  useEffect(() => addToLog(`mutedInFocusGroup set to [${mutedInFocusGroup.join(', ')}]`),
    [mutedInFocusGroup, addToLog]);

  useEffect(() => addToLog(`meetings set to [${meetings.join(', ')}]`),
    [meetings, addToLog]);

  useEffect(() => addToLog(`rejected set to [${rejected.join(', ')}]`),
    [rejected, addToLog]);

  useEffect(() => addToLog(`helpNeeded set to [${helpNeeded.join(', ')}]`),
    [helpNeeded, addToLog]);

  useEffect(() => {
    if (!admitted) return;
    addToLog(`approved set to [${admitted.join(', ')}]`);
  }, [admitted, addToLog]);

  useEffect(() => {
    const users = Object.keys(userAgents);
    const newUser = users[users.length - 1];
    if (newUser) addToLog(`${newUser} is using ${userAgents[newUser]}`);
  },[userAgents, addToLog]);

  return (
    <div style={{margin: '2em'}}>
      <AutoJoin role="log" />
      <Subscribe profile="data-only" />
      <h1>Log from {startTime.toLocaleTimeString()}</h1>
      { log.map((line, i) => (
        <p key={listKey('log', i)}>{line}</p>
      )) }
    </div>
  );
}


