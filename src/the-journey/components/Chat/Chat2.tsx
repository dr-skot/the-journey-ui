import React, { useContext, useEffect, useState } from 'react';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { tryToParse } from '../../utils/functional';
import { getLocalDataTrack, getUsername } from '../../utils/twilio';
// @ts-ignore
import { Launcher } from 'react-chat-window';
import 'react-chat-widget/lib/styles.css';
import '../../../chat.css';

interface ChatMessage {
  author: string,
  type: string,
  data: { text?: string }
}

export default function Chat() {
  const [{ room }] = useContext(TwilioRoomContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const me = room?.localParticipant;

  useEffect(() => {
    if (!room) return;
    function handleMessage(data: string) {
      const message = tryToParse(data) || {};
      const { from, payload: { chat } } = message;
      if (chat) {
        setMessages((prev) => [...prev, {
          author: getUsername(from),
          type: 'text',
          data: { text: chat },
        }]);
        setNewMessageCount((prev) => prev + 1);
      }
    }
    room.on('trackMessage', handleMessage); // listen
    getLocalDataTrack(room); // publish
    return () => {
      room.off('trackMessage', handleMessage)
      me?.dataTracks?.forEach((pub) => pub.unpublish());
    };
  }, [room, me])

  const onMessageWasSent = (message: ChatMessage) => {
    if (!room) return;
    if (message.type === 'text' && message.data?.text)
    getLocalDataTrack(room).then((track) =>
      track.send(JSON.stringify({
        from: me?.identity,
        payload: { chat: message.data.text },
      })));
    setMessages((prev) => [...prev, message]);
    setNewMessageCount(0);
  };

  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: "THE JOURNEY",
        }}
        onMessageWasSent={onMessageWasSent}
        messageList={messages}
        newMessagesCount={newMessageCount}
        showEmoji={false}
        />
    </div>
  );
}
