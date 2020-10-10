import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { Participant } from 'twilio-video';
import { useAppState } from '../../../../contexts/AppStateContext';
import { inGroup } from '../../../../utils/twilio';
import { Button } from '@material-ui/core';

const colors = [
  'lightgray',
  'orange',
  'dodgerblue',
  'lime',
  'fuchsia',
  'yellow',
  'aqua',
  'red',
  'forestgreen',
  'plum',
  'moccasin',
  'sienna',
  'deeppink',
  'olivedrab',
];

export default function RoommateButton(props: { participant: Participant }) {
  const [{ roommates }, appStateDispatch] = useAppState();
  const { participant } = props;
  const { identity } = participant;

  const roomNumber = 1 + roommates.findIndex((group) => inGroup(group)(participant));

  return <Button onClick={() => appStateDispatch('roommateRotate', { identity })}>
              <HomeIcon style={{ color: colors[roomNumber] }}/>
              { roomNumber || null }
          </Button>
}
