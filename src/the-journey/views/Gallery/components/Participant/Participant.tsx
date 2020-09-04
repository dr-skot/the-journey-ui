import React, { MouseEventHandler } from 'react';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantTracks from '../../../../components/ParticipantTracks';
import ParticipantInfo from './ParticipantInfo';

interface ParticipantProps {
  participant: IParticipant,
  star?: boolean,
  onClick?: MouseEventHandler;
  selectedIndex?: number;
  width: number,
  height: number,
  hotKey?: string;
  mute?: boolean;
}

export default function Participant({
  participant,
  star = false,
  onClick = () => {},
  selectedIndex = 0,
  width,
  height,
  hotKey,
  mute,
}: ParticipantProps) {
  return (
    <ParticipantInfo {...{ participant, onClick, selectedIndex, width, height, hotKey, star }}>
      <ParticipantTracks participant={participant} disableAudio={mute} />
    </ParticipantInfo>
  );
}
