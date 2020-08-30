import React, { MouseEventHandler } from 'react';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantTracks from '../../../../../components/ParticipantTracks/ParticipantTracks';
import ParticipantInfo from './ParticipantInfo';

interface ParticipantProps {
  participant: IParticipant,
  onClick: MouseEventHandler;
  selectedIndex: number;
  width: number,
  height: number,
  hotKey?: string;
  mute?: boolean;
}

export default function Participant({
  participant,
  onClick,
  selectedIndex,
  width,
  height,
  hotKey,
  mute,
}: ParticipantProps) {
  return (
    <ParticipantInfo {...{ participant, onClick, selectedIndex, width, height, hotKey }}>
      <ParticipantTracks participant={participant} disableAudio={mute} />
    </ParticipantInfo>
  );
}
