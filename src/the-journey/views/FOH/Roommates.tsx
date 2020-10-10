import React from 'react';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { getUsername, inGroup, isRole } from '../../utils/twilio';
import HomeIcon from '@material-ui/icons/Home';
import { useAppState } from '../../contexts/AppStateContext';
import { Participant } from 'twilio-video';

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

export default function Roommates() {
  const participants = useParticipants().filter(isRole('audience'));
  const [{ roommates }, appStateDispatch] = useAppState();

  const getRoomNumber = (participant: Participant) =>
    1 + roommates.findIndex((group) => inGroup(group)(participant));

  return <div>
    { participants.map((participant) => {
      const roomNumber = getRoomNumber(participant);
      const { identity } = participant;
      return <div key={identity}>
        <span style={{ color: colors[roomNumber] }}>
          <HomeIcon onClick={() => appStateDispatch('roommateRotate', { identity })}/>
          { roomNumber || null }
        </span>
        {getUsername(identity)}
      </div>
    }) }
  </div>
}

/*
export default function Roommates() {
  const participants = [
    'Fred', 'Betty', 'Wilma', 'Barney', 'Dino',
    'George', 'Jane', 'Elroy', 'Rocket', 'Dog',
    'George H', 'Ringo S', 'Paul M', 'John L', 'Pete B',
    'Harpo', 'Groucho', 'Chico', 'Zeppo', 'Karl',
    'Tyr', 'Thor', 'Odin', 'Freya', 'Loki',
  ];
  const [roommates, setRoommates] = useState<string[][]>([]);

  const getRoomNumber = (participant: string) =>
    1 + roommates.findIndex((group) => group.includes(participant));

  function handleClick(participant: string) {
    let roomNumber = getRoomNumber(participant);
    let mates = [...roommates];
    // leave current room if any
    if (roomNumber > 0) {
      mates[roomNumber - 1] = mates[roomNumber - 1].filter((name) => name !== participant);
    }
    const wasAloneInRoom = roomNumber > 0 && mates[roomNumber - 1].length === 0;
    // if we weren't alone in the last room, join or create next room
    if (!wasAloneInRoom || roomNumber < mates.length) {
        mates[roomNumber] = [...(mates[roomNumber] || []), participant];
    }
    // lose empty rooms
    setRoommates(mates.filter((group) => group.length > 0));
  }

  return <div>
    { participants.map((name) => {
      const roomNumber = getRoomNumber(name);
      return <div key={name}>
        <span style={{ color: colors[roomNumber] }}>
          <HomeIcon onClick={() => handleClick(name)}/>
          { roomNumber || null }
        </span>
        {name}
      </div>
    }) }
  </div>
}
 */
