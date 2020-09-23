import React, { useContext, useEffect } from 'react';
import { addResponseMessage, Widget } from 'react-chat-widget';
import { TwilioRoomContext } from '../../contexts/TwilioRoomContext';
import { tryToParse } from '../../utils/functional';
import { getLocalDataTrack, getUsername } from '../../utils/twilio';
import 'react-chat-widget/lib/styles.css';
import '../../../chat.css';

export default function Chat() {
  const [{ room }] = useContext(TwilioRoomContext);
  const me = room?.localParticipant;

  useEffect(() => {
    function handleMessage(data: string) {
      const message = tryToParse(data) || {};
      const { from, payload: { chat } } = message;
      if (chat) addResponseMessage(`${getUsername(from)}:\n${chat}`);
    }
    room?.on('trackMessage', handleMessage);
    return () => { room?.off('trackMessage', handleMessage) };
  }, [room])

  const handleNewUserMessage = (newMessage: string) => {
    if (!room) return;
    getLocalDataTrack(room).then((track) =>
      track.send(JSON.stringify({
        from: me?.identity,
        payload: { chat: newMessage },
      })));
  };

  return (
    <div>
      <Widget
        title="T H E &nbsp;&nbsp; J O U R N E Y"
        subtitle="chat window"
        handleNewUserMessage={handleNewUserMessage} />
    </div>
  );
}
