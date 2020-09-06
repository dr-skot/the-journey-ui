import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../../contexts/AppContext';
import { listKey } from '../../../../utils/react-help';
import { tryToParse } from '../../../../utils/functional';
import { getUsername } from '../../../../utils/twilio';
import { LocalDataTrack, RemoteParticipant } from 'twilio-video';
import ChatMessage from './ChatMessage';

interface Message {
  name: string,
  text: string,
}

export default function Chat() {
  const [{ room }, dispatch] = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // publish data track and listen for messages
    const alreadyOpen = room?.localParticipant.dataTracks.size || 0 > 0;
    if (!alreadyOpen) room?.localParticipant.publishTrack(new LocalDataTrack());
    const handleMessage = (data: string, _: any, participant: RemoteParticipant) => {
      const message = tryToParse(data);
      if (message.chat) setMessages((messages) => [ ...messages,
        { name: getUsername(participant.identity), text: message.chat }
      ]);
    };
    room?.on('trackMessage', handleMessage);
    return () => {
      room?.off('trackMessage', handleMessage);
      if (!alreadyOpen) room?.localParticipant.dataTracks
        .forEach((pub) => pub.unpublish());
    }
  }, [room]);

  return (
    <div>
      { messages.map((message, i) =>
        <ChatMessage
          key={listKey('message', i)}
          name={message.name} text={message.text}
        />
      )}
    </div>
  )
}
