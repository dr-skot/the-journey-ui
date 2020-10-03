import React, { useEffect, useState } from 'react';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import AutoJoin from '../../components/AutoJoin';
import { RemoteParticipant } from 'twilio-video';
import { useAppState } from '../../contexts/AppStateContext';
import Subscribe from '../../subscribers/Subscribe';
import { getUsername } from '../../utils/twilio';

type EventType = 'connect' | 'disconnect';

interface EventLog {
  time: Date,
  event: EventType,
  identity: string,
  sid: string
}

interface UserRecord {
  userAgents: string[],
  events: EventLog[],
}

type Audience = Record<string, UserRecord>;

export default function Log2() {
  const [{ room }] = useTwilioRoomContext();
  const [{ userAgents }] = useAppState();
  const [audience, setAudience] = useState<Audience>({})
  const [startTime] = useState(new Date())

  useEffect(() => {
    if (room) {
      function registerEvent(p: RemoteParticipant, event: EventType) {
        const { identity, sid } = p;
        const name = getUsername(identity);
        const eventLog = { time: new Date(), event, identity, sid };
        setAudience((prev) => {
          const record = prev[name] || { userAgents: [], events: [] }
          return { ...prev,
            [name]: { ...record, events: [...record.events, eventLog ] }
          }
        });
      }
      const participantConnected = (p: RemoteParticipant) =>
        registerEvent(p, 'connect')
      const participantDisconnected = (p: RemoteParticipant) =>
        registerEvent(p, 'disconnect');

      room.on('participantConnected', participantConnected)
        .on('participantDisconnected', participantDisconnected);

      return () => {
        room.off('participantConnected', participantConnected)
          .off('participantDisconnected', participantDisconnected);
      }
    }
  }, [room, setAudience]);

  useEffect(() => {
    Object.keys(userAgents).forEach((identity) => {
      const name = getUsername(identity);
      if (!audience[name]?.userAgents.includes(userAgents[identity])) {
        setAudience((prev) => {
          const record = prev[name] || { userAgents: [], events: []};
          const uAs = [...record.userAgents, userAgents[identity]];
          return { ...prev, [name]: { ...record, userAgents: uAs } };
        })
      }
    })
  },[userAgents, audience, setAudience]);

  return (
    <div style={{margin: '2em'}}>
      <AutoJoin role="log" />
      <Subscribe profile="data-only" />
      <h1>Room {room?.name}, sid {room?.sid}</h1>
      <h2>Log from {startTime.toLocaleTimeString()}</h2>
      { Object.keys(audience).map((name) => {
        const { userAgents, events } = audience[name];
        return <>
          <h3 key={name}>{name} -- {userAgents.join(' | ')}</h3>
          <p>
          { events.map(({ time, event, identity, sid }) => (
            <>{time.toLocaleTimeString()}: {event} as {identity} sid {sid}<br/></>
          )) }
          </p>
        </>
      })}
    </div>
  );
}


