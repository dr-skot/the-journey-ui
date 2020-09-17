import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantVideo from './ParticipantVideo';
import ParticipantInfoOverlay from './ParticipantInfo/ParticipantInfoOverlay';

interface ParticipantProps {
  participant: IParticipant,
  onClick?: MouseEventHandler;
  width?: number,
  height?: number,
  selectedIndex?: number;
  hotKey?: string;
  mutable?: boolean,
}

export default function ParticipantVideoWindow({
  participant,
  onClick,
  selectedIndex = 0,
  width,
  height,
  hotKey,
  mutable,
}: ParticipantProps) {
  const [, rerender] = useState(false);

  useEffect(() => {
    const update = () => rerender((prev) => !prev)
    participant.on('trackSubscribed', update);
    participant.on('trackUnsubscribed', update);
    return () => {
      participant.off('trackSubscribed', update);
      participant.off('trackUnsubscribed', update);
    }
  })

  return (
    <ParticipantInfoOverlay {...{ participant, onClick, width, height, selectedIndex, hotKey, mutable }}>
      <ParticipantVideo participant={participant} />
    </ParticipantInfoOverlay>
  );
}
