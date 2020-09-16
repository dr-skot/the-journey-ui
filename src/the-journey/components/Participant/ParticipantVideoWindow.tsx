import React, { MouseEventHandler } from 'react';
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
  return (
    <ParticipantInfoOverlay {...{ participant, onClick, width, height, selectedIndex, hotKey, mutable }}>
      <ParticipantVideo participant={participant} />
    </ParticipantInfoOverlay>
  );
}
