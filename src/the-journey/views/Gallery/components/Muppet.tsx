import React from 'react';
import { muppetImageForIdx } from '../../../components/Participant/Muppet';
import SelectionNumber from '../../../components/Participant/ParticipantInfo/SelectionNumber/SelectionNumber';

interface MuppetProps {
  width: number;
  height: number;
  index: number;
  number?: number;
}

export default function Muppet({ width, height, index, number }: MuppetProps) {
  const image = `url(${muppetImageForIdx(index + 1)})`; // muppets start at 1 not 0
  return (
    <div style={{ width, height, border: '0.5px solid black' }}>
      <div style={{ width, height, backgroundImage: image, backgroundSize: 'cover' }}>
        { number && <SelectionNumber number={number} /> }
      </div>
    </div>
  )
}
