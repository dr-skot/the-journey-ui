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
}

export default function ParticipantVideoWindow({
  participant,
  onClick,
  selectedIndex = 0,
  width,
  height,
  hotKey,
}: ParticipantProps) {
  return (
    <ParticipantInfoOverlay {...{ participant, onClick, width, height, selectedIndex, hotKey }}>
      <ParticipantVideo participant={participant} />
    </ParticipantInfoOverlay>
  );
}
